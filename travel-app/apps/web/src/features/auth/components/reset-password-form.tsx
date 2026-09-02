"use client";

import {
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import Link from "next/link";

import {
  useForm,
} from "react-hook-form";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
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

interface ResetPasswordValues {
  password: string;
  confirmPassword: string;
}

export function ResetPasswordForm() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const token =
    searchParams.get("token");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ResetPasswordValues>();

  const password =
    watch("password");

  const onSubmit = async (
    values: ResetPasswordValues,
  ) => {
    try {
      setError(null);

      if (!token) {
        throw new Error(
          "Reset link is invalid or expired.",
        );
      }

      /*
       * TODO:
       *
       * await resetPassword({
       *   token,
       *   password: values.password,
       * })
       */

      console.log(
        "Reset password:",
        token,
        values.password,
      );

      setSuccess(true);
    } catch (error: any) {
      setError(
        error?.message ??
          "Unable to reset your password.",
      );
    }
  };

  if (success) {
    return (
      <AuthShell
        title="Password updated"
        description="Your password has been changed successfully."
      >
        <div className="text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-7" />
          </div>

          <p className="text-sm text-muted-foreground">
            You can now sign in using your
            new password.
          </p>

          <Button
            className="mt-6 h-11 w-full rounded-xl"
            onClick={() =>
              router.replace("/login")
            }
          >
            Go to sign in
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create a new password"
      description="Choose a strong password that you haven't used before."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        {/* PASSWORD */}

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium"
          >
            New password
          </label>

          <div className="relative">
            <Input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter new password"
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

        {/* CONFIRM */}

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium"
          >
            Confirm new password
          </label>

          <div className="relative">
            <Input
              id="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Repeat new password"
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

        {!token && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            This reset link is missing or
            invalid.
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={
            isSubmitting || !token
          }
          className="h-11 w-full rounded-xl"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-7 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to sign in
      </Link>
    </AuthShell>
  );
}