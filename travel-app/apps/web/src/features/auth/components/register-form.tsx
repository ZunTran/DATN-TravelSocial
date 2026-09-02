"use client";

import { useState } from "react";
import {
  useRouter,
} from "next/navigation";

import Link from "next/link";

import {
  useForm,
} from "react-hook-form";

import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  AuthShell,
} from "./auth-shell";

import {
  useAuthContext,
} from "../context/auth-context";

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const router = useRouter();

  const {
    register: registerUser,
  } = useAuthContext();

  const [error, setError] =
    useState<string | null>(null);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormValues>();

  const password =
    watch("password");

  const onSubmit = async (
    values: RegisterFormValues,
  ) => {
    try {
      setError(null);

      await registerUser(
        values.email,
        values.password,
      );

      router.push("/profile");

    } catch (error: any) {
      setError(
        error?.message ??
          "Unable to create your account.",
      );
    }
  };

  return (
    <AuthShell
      title="Create your account"
      description="Join Travel Social and start sharing your journey."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        {/* EMAIL */}

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium"
          >
            Email
          </label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="h-11 rounded-xl"
            {...register("email", {
              required:
                "Email is required.",
              pattern: {
                value:
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message:
                  "Please enter a valid email.",
              },
            })}
          />

          {errors.email && (
            <p className="text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* PASSWORD */}

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium"
          >
            Password
          </label>

          <div className="relative">
            <Input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Create a password"
              autoComplete="new-password"
              className="h-11 rounded-xl pr-11"
              {...register("password", {
                required:
                  "Password is required.",
                minLength: {
                  value: 8,
                  message:
                    "Password must be at least 8 characters.",
                },
              })}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (value) => !value,
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium"
          >
            Confirm password
          </label>

          <div className="relative">
            <Input
              id="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Repeat your password"
              autoComplete="new-password"
              className="h-11 rounded-xl pr-11"
              {...register(
                "confirmPassword",
                {
                  required:
                    "Please confirm your password.",
                  validate: (value) =>
                    value === password ||
                    "Passwords do not match.",
                },
              )}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (value) => !value,
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {
                errors.confirmPassword
                  .message
              }
            </p>
          )}
        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* SUBMIT */}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-xl"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <div className="mt-7 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
}