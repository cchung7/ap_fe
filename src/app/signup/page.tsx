// D:\ap_fe\src\app\signup\page.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { SignUpForm } from "@/components/signup/SignUpForm";
import { useMe } from "@/hooks/useMe";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignUpPage() {
  const router = useRouter();
  const { loading, isAuthed, isAdmin } = useMe();

  const didSubmitNavigateRef = React.useRef(false);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (didSubmitNavigateRef.current) return;
    if (loading) return;
    if (!isAuthed) return;

    startTransition(() => {
      router.replace(isAdmin ? "/admin" : "/");
    });
  }, [loading, isAuthed, isAdmin, router]);

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
          <Card className="w-full max-w-2xl border-2 border-border/40 bg-card/90 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-4 text-center pb-8 pt-6">
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
                Create An Account
              </CardTitle>

              <CardDescription className="ui-body max-w-sm mx-auto text-sm md:text-base font-medium text-muted-foreground">
                <>
                  <span className="inline-block text-[11px] md:text-xs font-black uppercase tracking-widest text-muted-foreground/80">
                    Already have an account?
                  </span>
                  <br />
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-accent underline underline-offset-4 hover:text-foreground transition-colors"
                  >
                    Sign in
                  </Link>
                </>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <SignUpForm isPending={isPending} />
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