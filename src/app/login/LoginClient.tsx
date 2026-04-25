"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/useMe";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";

import { Eye, EyeOff, ChevronLeft, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginSuccessPayload = {
  message?: string;
  success?: boolean;
  data?: {
    token?: string;
    role?: "ADMIN" | "MEMBER" | string;
    status?: "PENDING" | "ACTIVE" | "SUSPENDED" | string;
  };
};

type LoginErrorPayload = {
  message?: string;
  errorSources?: unknown;
  err?: unknown;
  success?: boolean;
};

function isSafeInternalPath(path: string | null): path is string {
  if (!path) return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("://")) return false;
  return true;
}

function normalizeLoginError(
  status: number,
  payload: LoginErrorPayload
): string {
  const payloadMessage = (payload?.message || "").trim();
  const rawMessage = payloadMessage.toLowerCase();

  if (status === 403) {
    if (rawMessage.includes("suspend")) {
      return (
        payloadMessage ||
        "This account has been suspended. Please contact an administrator."
      );
    }

    if (rawMessage.includes("pending")) {
      return (
        payloadMessage ||
        "Your account is pending approval before it can be used to sign in."
      );
    }

    return (
      payloadMessage ||
      "Your account does not currently have access to sign in."
    );
  }

  if (status === 400 || status === 401) {
    if (
      rawMessage.includes("password") ||
      rawMessage.includes("credential") ||
      rawMessage.includes("credentials")
    ) {
      return "Please enter a valid password.";
    }

    return payloadMessage || "Invalid sign-in request.";
  }

  if (status === 404) {
    return "Please enter a valid email address.";
  }

  if (
    rawMessage.includes("not found") ||
    rawMessage.includes("email") ||
    rawMessage.includes("user")
  ) {
    return "Please enter a valid email address.";
  }

  if (status >= 500) {
    return "Something went wrong on the server while trying to sign you in. Please try again shortly.";
  }

  return payloadMessage || "An unexpected error occurred during sign-in.";
}

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = useMemo(() => searchParams.get("next"), [searchParams]);

  const { loading: meLoading, isAuthed, isAdmin } = useMe();
  const { showError, showSuccess, clear } = useGlobalStatusBanner();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (meLoading) return;
    if (!isAuthed) return;

    router.replace(isAdmin ? "/admin" : "/");
    router.refresh();
  }, [meLoading, isAuthed, isAdmin, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clear();
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      showError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!password) {
      showError("Please enter a valid password.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as
        | LoginErrorPayload
        | LoginSuccessPayload;

      if (!response.ok) {
        showError(
          normalizeLoginError(response.status, data as LoginErrorPayload)
        );
        return;
      }

      const loginData = data as LoginSuccessPayload;
      const safeNext = isSafeInternalPath(nextParam) ? nextParam : null;
      const nextIsAdminRoute = Boolean(
        safeNext && safeNext.startsWith("/admin")
      );
      const role = (loginData?.data?.role || "").toString();
      const status = (loginData?.data?.status || "").toString();

      if (status === "PENDING") {
        showSuccess(
          "Signed in successfully. Your account is pending approval, so event registration is not available yet."
        );
      } else {
        showSuccess(loginData?.message || "Signed in successfully!");
      }

      let destination = "/";

      if (role === "ADMIN") {
        destination = safeNext || "/admin";
      } else {
        destination = safeNext && !nextIsAdminRoute ? safeNext : "/";
      }

      window.setTimeout(() => {
        window.location.href = destination;
      }, 700);
    } catch (err: unknown) {
      console.error("Unexpected login failure:", err);
      showError(
        "We could not reach the server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
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
                Welcome
              </CardTitle>

              <CardDescription className="mx-auto max-w-sm text-center text-sm font-medium leading-7 text-muted-foreground md:text-base">
                {!meLoading && !isAuthed ? (
                  <>
                    <span className="inline-block text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 md:text-xs">
                      Don&apos;t have an account?
                    </span>
                    <br />
                    <Link
                      href="/signup"
                      className="text-sm font-semibold text-accent underline underline-offset-4 transition-colors hover:text-foreground"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <span />
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-7 pb-7">
              <form onSubmit={handleLogin} noValidate className="space-y-6">
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
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => {
                        clear();
                        setEmail(e.target.value);
                      }}
                      className="h-12 rounded-xl border-border/40 bg-secondary/20 pl-10 text-sm text-primary placeholder:text-xs focus:border-accent md:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="ui-eyebrow pl-1 text-muted-foreground"
                  >
                    Password
                  </Label>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="password"
                      onChange={(e) => {
                        clear();
                        setPassword(e.target.value);
                      }}
                      className="h-12 rounded-xl border-border/40 bg-secondary/20 pl-10 pr-12 text-sm text-primary placeholder:text-xs focus:border-accent md:text-base"
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

                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-accent underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full rounded-full px-6 text-sm font-semibold tracking-[0.02em] shadow-none transition-all hover:-translate-y-0.5 hover:bg-accent md:h-12 md:px-7 md:text-base md:tracking-wide"
                  disabled={loading}
                >
                  {loading ? "Authenticating..." : "Sign In"}
                </Button>

                <div className="pt-2 text-center">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                  >
                    <ChevronLeft size={16} />
                    Back to Home
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