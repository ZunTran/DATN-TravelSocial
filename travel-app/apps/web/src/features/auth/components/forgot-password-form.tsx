"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  useForm,
} from "react-hook-form";

import {
  ArrowLeft,
  Mail,
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

interface ForgotPasswordValues {
  email: string;
}

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ForgotPasswordValues>();

  const onSubmit = async (
    values: ForgotPasswordValues,
  ) => {
    try {
      setError(null);

      /*
       * TODO:
       * Gọi forgotPassword mutation
       *
       * await forgotPassword(values.email)
       */

      console.log(
        "Forgot password:",
        values.email,
      );

      setSubmitted(true);
    } catch (error: any) {
      setError(
        error?.message ??
          "Unable to process your request.",
      );
    }
  };

  if (submitted) {
    return (
      <AuthShell
        title="Check your email"
        description="If an account exists with this email, we've sent instructions to reset your password."
      >
        <div className="text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-7" />
          </div>

          <p className="text-sm leading-6 text-muted-foreground">
            Check your inbox and follow the
            link in the email to continue.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot your password?"
      description="Enter your email and we'll send you a link to reset your password."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium"
          >
            Email
          </label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="h-11 rounded-xl pl-10"
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
          </div>

          {errors.email && (
            <p className="text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-xl"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-7 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to sign in
      </Link>
    </AuthShell>
  );
}