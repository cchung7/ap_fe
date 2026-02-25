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
      const nextIsAdminRoute = Boolean(safeNext && safeNext.startsWith("/admin"));

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
    // <-- your existing JSX stays exactly the same
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* ...snip... */}
    </div>
  );
}