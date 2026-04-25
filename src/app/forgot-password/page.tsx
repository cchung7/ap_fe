"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";

type ApiResponse = {
  success?: boolean;
  message?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showError, showSuccess, clear } = useGlobalStatusBanner();

  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clear();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      showError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = (await response.json().catch(() => ({}))) as ApiResponse;

      if (!response.ok) {
        showError(data?.message || "Unable to send password reset code.");
        return;
      }

      showSuccess(data?.message || "A password reset code has been sent to your email.");

      window.setTimeout(() => {
        router.push(
          `/forgot-password/otp?email=${encodeURIComponent(normalizedEmail)}`
        );
      }, 700);
    } catch (err) {
      console.error("Forgot password error:", err);
      showError(
        "We could not reach the server. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/auth/sva_auth.jpg"
        alt="SVA Authentication Background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/10" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-accent/10 blur-[110px]" />
      </div>

      <div className="relative z-10 min-h-screen px-6 pt-2 pb-12 md:pt-6">
        <div className="flex flex-col items-center justify-start pt-4 md:pt-6">
          <Card className="w-full max-w-md border-2 border-border/40 bg-card/90 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-4 text-center pb-8 pt-4">
              <div className="flex justify-center mb-2">
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

              <CardTitle className="ui-title text-[2rem] md:text-[2.3rem] uppercase italic">
                Reset Password
              </CardTitle>

              <CardDescription className="ui-body max-w-sm mx-auto text-sm md:text-base font-medium text-muted-foreground">
                Enter your account email and we&apos;ll send you a verification code.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={onSubmit} noValidate className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="ui-eyebrow pl-1 text-muted-foreground"
                  >
                    Email Address
                  </Label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        clear();
                        setEmail(e.target.value);
                      }}
                      className="pl-10 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-sm md:text-base text-primary"
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full rounded-full px-6 text-sm font-semibold tracking-[0.02em] shadow-none transition-all hover:-translate-y-0.5 hover:bg-accent md:h-12 md:px-7 md:text-base md:tracking-wide"
                  disabled={submitting}
                >
                  {submitting ? "Sending Code..." : "Send Reset Code"}
                </Button>

                <div className="pt-2 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    <ChevronLeft size={16} />
                    Back to Sign In
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="mt-4 text-center text-xs text-white/80 font-semibold uppercase tracking-widest">
            All Rights Reserved. &copy;
            <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            SVA | UT-Dallas
          </p>
        </div>
      </div>
    </div>
  );
}