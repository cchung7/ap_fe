"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/useMe";

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

  if (
    status === 404 ||
    rawMessage.includes("email") ||
    rawMessage.includes("user") ||
    rawMessage.includes("account") ||
    rawMessage.includes("not found")
  ) {
    return "Please enter a valid email address.";
  }

  if (
    status === 400 ||
    status === 401 ||
    rawMessage.includes("password") ||
    rawMessage.includes("credential") ||
    rawMessage.includes("credentials")
  ) {
    return "Please enter a valid password.";
  }

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
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!password) {
      toast.error("Please enter a valid password.");
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
        toast.error(
          normalizeLoginError(response.status, data as LoginErrorPayload)
        );
        return;
      }

      toast.success("Signed in successfully!", {
        description: "Redirecting...",
      });

      const safeNext = isSafeInternalPath(nextParam) ? nextParam : null;
      const nextIsAdminRoute = Boolean(
        safeNext && safeNext.startsWith("/admin")
      );
      const role = (((data as LoginSuccessPayload)?.data?.role || "") as string)
        .toString();

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
      toast.error(
        "We could not reach the server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
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

      <div className="relative z-10 min-h-screen px-6 pt-2 pb-24 md:pt-24">
        <div className="flex flex-col items-center justify-start pt-8 md:pt-12">
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
                Welcome
              </CardTitle>

              <CardDescription className="ui-body max-w-sm mx-auto text-sm md:text-base font-medium text-muted-foreground">
                {!meLoading && !isAuthed ? (
                  <>
                    <span className="inline-block text-[11px] md:text-xs font-black uppercase tracking-widest text-muted-foreground/80">
                      Don&apos;t have an account?
                    </span>
                    <br />
                    <Link
                      href="/signup"
                      className="text-sm font-semibold text-accent underline underline-offset-4 hover:text-foreground transition-colors"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <span />
                )}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} noValidate className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="ui-eyebrow pl-1 text-muted-foreground"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-sm md:text-base text-primary"
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
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="password"
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-12 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-sm md:text-base text-primary"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 md:h-12 rounded-full px-6 md:px-7 text-sm md:text-base font-semibold tracking-[0.02em] md:tracking-wide shadow-none transition-all hover:-translate-y-0.5 hover:bg-accent"
                  disabled={loading}
                >
                  {loading ? "Authenticating..." : "Sign In"}
                </Button>

                <div className="pt-2 text-center">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
                  >
                    <ChevronLeft size={16} />
                    Back to Home
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="mt-4 text-center text-xs text-white/80 font-semibold uppercase tracking-widest">
            All Rights Reserved. &copy;{""}
            <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            SVA | UT-Dallas
          </p>
        </div>
      </div>
    </div>
  );
}