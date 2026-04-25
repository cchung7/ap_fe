"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Eye, EyeOff, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";

type ApiResponse = {
  success?: boolean;
  message?: string;
};

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = React.useMemo(
    () => (searchParams.get("email") || "").trim().toLowerCase(),
    [searchParams]
  );

  const { showError, showSuccess, clear } = useGlobalStatusBanner();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!email) {
      showError("Email is missing. Please restart the password reset process.");
    }
  }, [email, showError]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clear();

    if (!email) {
      showError("Email is missing. Please restart the password reset process.");
      return;
    }

    if (!password) {
      showError("Please enter a new password.");
      return;
    }

    if (password.length < 8) {
      showError("Password must be at least 8 characters.");
      return;
    }

    if (!confirmPassword) {
      showError("Please confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as ApiResponse;

      if (!response.ok) {
        showError(data?.message || "Password reset could not be completed.");
        return;
      }

      showSuccess(
        data?.message ||
          "Password reset successful. Please sign in with your new password."
      );

      window.setTimeout(() => {
        router.replace("/login");
      }, 900);
    } catch (err) {
      console.error("Reset password error:", err);
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
                New Password
              </CardTitle>

              <CardDescription className="ui-body max-w-sm mx-auto text-sm md:text-base font-medium text-muted-foreground">
                Create a new password for{" "}
                <span className="font-semibold text-foreground">
                  {email || "your account"}
                </span>
                .
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={onSubmit} noValidate className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="ui-eyebrow pl-1 text-muted-foreground"
                  >
                    New Password
                  </Label>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        clear();
                        setPassword(e.target.value);
                      }}
                      className="pl-10 pr-12 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-sm md:text-base text-primary"
                      placeholder="Create a new password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="ui-eyebrow pl-1 text-muted-foreground"
                  >
                    Confirm New Password
                  </Label>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        clear();
                        setConfirmPassword(e.target.value);
                      }}
                      className="pl-10 pr-12 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-sm md:text-base text-primary"
                      placeholder="Confirm your new password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full rounded-full px-6 text-sm font-semibold tracking-[0.02em] shadow-none transition-all hover:-translate-y-0.5 hover:bg-accent md:h-12 md:px-7 md:text-base md:tracking-wide"
                  disabled={submitting}
                >
                  {submitting ? "Updating Password..." : "Reset Password"}
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