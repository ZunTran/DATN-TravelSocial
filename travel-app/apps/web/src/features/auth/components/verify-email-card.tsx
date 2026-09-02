"use client";

import {
  useState,
} from "react";

import {
  useSearchParams,
  useRouter,
} from "next/navigation";

import Link from "next/link";

import {
  Mail,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  AuthShell,
} from "./auth-shell";

export function VerifyEmailCard() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const email =
    searchParams.get("email");

  const token =
    searchParams.get("token");

  const [verified, setVerified] =
    useState(false);

  const [resent, setResent] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * TOKEN VERIFICATION
   */

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError(null);

      /*
       * TODO:
       *
       * await verifyEmail(token)
       */

      console.log(
        "Verify email:",
        token,
      );

      setVerified(true);
    } catch (error: any) {
      setError(
        error?.message ??
          "Unable to verify your email.",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * RESEND
   */

  const handleResend = async () => {
    try {
      setLoading(true);
      setError(null);

      /*
       * TODO:
       *
       * await resendVerificationEmail(email)
       */

      console.log(
        "Resend verification:",
        email,
      );

      setResent(true);
    } catch (error: any) {
      setError(
        error?.message ??
          "Unable to resend verification email.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <AuthShell
        title="Email verified"
        description="Your email has been successfully verified."
      >
        <div className="text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-7" />
          </div>

          <p className="text-sm leading-6 text-muted-foreground">
            Your account is ready. You can
            now sign in.
          </p>

          <Button
            onClick={() =>
              router.replace("/login")
            }
            className="mt-6 h-11 w-full rounded-xl"
          >
            Continue to sign in
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Verify your email"
      description="We've sent a verification link to your email address."
    >
      <div className="text-center">

        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Mail className="size-7" />
        </div>

        {email ? (
          <p className="text-sm leading-6 text-muted-foreground">
            We sent an email to{" "}
            <span className="font-semibold text-foreground">
              {email}
            </span>
            .
          </p>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            Check your inbox for the
            verification link.
          </p>
        )}

        <div className="mt-6 rounded-2xl border bg-muted/40 p-4 text-left">
          <p className="text-sm font-medium">
            Didn't receive the email?
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Check your spam folder or request
            another verification email.
          </p>
        </div>

        {resent && (
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
            Verification email sent again.
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mt-5 space-y-3">

          {token ? (
            <Button
              onClick={handleVerify}
              disabled={loading}
              className="h-11 w-full rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify email"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleResend}
              disabled={
                loading || !email
              }
              variant="outline"
              className="h-11 w-full rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend verification email"
              )}
            </Button>
          )}
        </div>

        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </div>
    </AuthShell>
  );
}