

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  useForm,
} from "react-hook-form";

import {
  Loader2,
  Eye,
  EyeOff,
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

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();

  const {
    login,
    isLoading: sessionLoading,
  } = useAuthContext();

  const [error, setError] =
    useState<string | null>(null);

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormValues>();

  const onSubmit = async (
    values: LoginFormValues,
  ) => {
    try {
      setError(null);

      await login(
        values.email,
        values.password,
      );

      router.replace("/");
    } catch (error: any) {
      setError(
        error?.message ??
          "Email hoặc mật khẩu không đúng.",
      );
    }
  };

  const loading =
    isSubmitting || sessionLoading;

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue your journey with Travel Social."
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
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium"
            >
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-11 rounded-xl pr-11"
              {...register("password", {
                required:
                  "Password is required.",
              })}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (value) => !value,
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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

        {/* ERROR */}

        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* SUBMIT */}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="mt-7 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create account
        </Link>
      </div>
    </AuthShell>
  );
}