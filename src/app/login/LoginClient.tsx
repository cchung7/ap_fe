/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type MeResponse = {
  role?: "ADMIN" | "MEMBER" | string;
  subRole?: string;
  [key: string]: unknown;
};

function isSafeInternalPath(path: string | null): path is string {
  if (!path) return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("://")) return false;
  return true;
}

export default function LoginClient() {
  const searchParams = useSearchParams();
  const nextParam = useMemo(() => searchParams.get("next"), [searchParams]);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Determine role using /api/auth/me (cookie is httpOnly, so client cannot read it)
      const meRes = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      const meData: MeResponse = await meRes.json();

      if (!meRes.ok) {
        const fallback = isSafeInternalPath(nextParam) ? nextParam : "/";
        window.location.href = fallback;
        return;
      }

      const role = (meData.role || "").toString();

      const safeNext = isSafeInternalPath(nextParam) ? nextParam : null;
      const nextIsAdminRoute = Boolean(
        safeNext && safeNext.startsWith("/admin")
      );

      let destination = "/";

      if (role === "ADMIN") {
        destination = safeNext || "/admin";
      } else {
        destination = safeNext && !nextIsAdminRoute ? safeNext : "/";
      }

      window.location.href = destination;
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image (BPC style) */}
      <Image
        src="/auth/sva_auth.jpg"
        alt="SVA Authentication Background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Lighter overlay (less dark) */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Optional: Decorative glow elements over the photo (subtle) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-accent/10 blur-[110px]" />
      </div>

      {/* Page content */}
      <div className="relative z-10 min-h-screen px-6 pt-8 pb-24">
        {/* Centered card */}
        <div className="flex flex-col items-center justify-start pt-6">
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

              <CardTitle className="text-3xl font-black uppercase italic tracking-tighter">
                Welcome
              </CardTitle>

              <CardDescription className="text-muted-foreground font-medium uppercase tracking-widest text-xs">
                <span>Don&apos;t have an account?</span>
                <br />
                <Link
                  href="/signup"
                  className="underline underline-offset-4 hover:text-foreground transition-colors text-accent font-semibold"
                >
                  Sign up
                </Link>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[12px] font-black uppercase tracking-widest text-muted-foreground pl-1"
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
                      className="pl-10 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-xs text-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-[12px] font-black uppercase tracking-widest text-muted-foreground pl-1"
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
                      className="pl-10 pr-12 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-xs text-primary"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium text-center">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? "Authenticating..." : "Sign In"}
                </Button>

                {/* Back link moved below form, centered */}
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

          <p className="mt-10 text-center text-xs text-white/80 font-medium uppercase tracking-widest">
            All Rights Reserved. &copy;{" "}
            <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            SVA | UTDallas Chapter
          </p>
        </div>
      </div>
    </div>
  );
}