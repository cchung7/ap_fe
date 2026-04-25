"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";

type ApiResponse = {
  success?: boolean;
  message?: string;
};

const OTP_LENGTH = 6;

export default function OtpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = React.useMemo(
    () => (searchParams.get("email") || "").trim().toLowerCase(),
    [searchParams]
  );

  const { showError, showSuccess, clear } = useGlobalStatusBanner();

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOtpValues] = React.useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [submitting, setSubmitting] = React.useState(false);
  const [resending, setResending] = React.useState(false);

  const otp = otpValues.join("");
  const isComplete = otp.length === OTP_LENGTH && /^\d{6}$/.test(otp);

  React.useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  React.useEffect(() => {
    if (!email) {
      showError("Email is missing. Please restart the password reset process.");
    }
  }, [email, showError]);

  const setOtpAt = React.useCallback(
    (index: number, value: string) => {
      clear();

      const digits = value.replace(/\D/g, "");

      if (!digits) {
        setOtpValues((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
        return;
      }

      setOtpValues((prev) => {
        const next = [...prev];

        digits
          .slice(0, OTP_LENGTH - index)
          .split("")
          .forEach((digit, offset) => {
            next[index + offset] = digit;
          });

        return next;
      });

      const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
    },
    [clear]
  );

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResend = async () => {
    clear();

    if (!email) {
      showError("Email is missing. Please restart the password reset process.");
      return;
    }

    setResending(true);

    try {
      const response = await fetch("/api/auth/resend-password-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = (await response.json().catch(() => ({}))) as ApiResponse;

      if (!response.ok) {
        showError(data?.message || "Unable to resend password reset code.");
        if (response.status === 404) {
          window.setTimeout(() => {
            router.replace("/forgot-password");
          }, 900);
        }
        return;
      }

      setOtpValues(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();

      showSuccess(
        data?.message ||
          "If an account exists for that email, a password reset code has been sent."
      );
    } catch (err) {
      console.error("Resend password reset OTP error:", err);
      showError(
        "We could not reach the server. Please check your connection and try again."
      );
    } finally {
      setResending(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clear();

    if (!email) {
      showError("Email is missing. Please restart the password reset process.");
      return;
    }

    if (!isComplete) {
      showError("Please enter the 6-digit verification code.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/verify-password-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });

      const data = (await response.json().catch(() => ({}))) as ApiResponse;

      if (!response.ok) {
        showError(data?.message || "Invalid or expired password reset code.");
        return;
      }

      showSuccess(data?.message || "Password reset code verified.");

      window.setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 700);
    } catch (err) {
      console.error("Verify password reset OTP error:", err);
      showError(
        "We could not reach the server. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/auth/sva_auth.jpg"
        alt="SVA Authentication Background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/25" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-accent/10 blur-[110px]" />
      </div>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <Card className="w-full border-2 border-border/40 bg-card/92 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-5 px-7 pb-8 pt-7 text-center">
              <div className="flex justify-center">
                <div className="relative h-20 w-20">
                  <Image
                    src="/logo/logo.png"
                    alt="SVA Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <CardTitle className="ui-title text-[2rem] uppercase italic tracking-tight md:text-[2.3rem]">
                Enter Code
              </CardTitle>

              <CardDescription className="mx-auto max-w-sm text-center text-sm font-medium leading-7 text-muted-foreground md:text-base">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-foreground">
                  {email || "your email"}
                </span>
                .
              </CardDescription>
            </CardHeader>

            <CardContent className="px-7 pb-7">
              <form onSubmit={onSubmit} noValidate className="space-y-6">
                <div className="flex justify-between gap-2 sm:gap-3">
                  {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={OTP_LENGTH}
                      value={otpValues[index]}
                      onChange={(e) => setOtpAt(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="aspect-square w-full rounded-xl border border-border/40 bg-secondary/20 text-center text-lg font-bold text-primary outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
                      aria-label={`Digit ${
                        index + 1
                      } of password reset code`}
                    />
                  ))}
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Didn&apos;t get a code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="font-semibold text-accent underline underline-offset-4 transition-colors hover:text-foreground disabled:opacity-60"
                  >
                    {resending ? "Resending..." : "Resend code"}
                  </button>
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full rounded-full px-6 text-sm font-semibold tracking-[0.02em] shadow-none transition-all hover:-translate-y-0.5 hover:bg-accent md:h-12 md:px-7 md:text-base md:tracking-wide"
                  disabled={submitting || !isComplete}
                >
                  {submitting ? "Verifying..." : "Verify Code"}
                </Button>

                <div className="pt-2 text-center">
                  <Link
                    href="/forgot-password"
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    <ChevronLeft size={16} />
                    Back
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="mt-4 text-center text-xs font-semibold uppercase tracking-widest text-white/85">
            All Rights Reserved. &copy;
            <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            SVA | UT-Dallas
          </p>
        </div>
      </section>
    </main>
  );
}