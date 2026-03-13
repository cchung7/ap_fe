"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { useMe } from "@/hooks/useMe";

function XLogoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      {...props}
    >
      <path d="M18.9 2H22l-6.9 7.9L23 22h-6.6l-5.2-6.7L5.4 22H2.2l7.4-8.6L1 2h6.8l4.7 6.1L18.9 2Zm-1.2 18h1.7L6.9 3.9H5.1L17.7 20Z" />
    </svg>
  );
}

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const { isAuthed } = useMe();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full border-t border-border/40 bg-secondary/30 px-6 py-6">
      <div className="container mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
        <div className="group flex flex-col items-center gap-1">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative flex h-14 w-14 items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/logo/logo.png"
                alt="SVA UT-Dallas Logo"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <h4 className="font-heading text-2xl font-black uppercase italic tracking-tighter text-foreground">
            <span className="text-muted-foreground/60">SVA- UT-Dallas</span>
          </h4>
        </div>

        <nav className="flex flex-wrap justify-center gap-4 text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">
          <Link
            href="/"
            className="transform transition-colors hover:scale-105 hover:text-accent"
          >
            Home
          </Link>
          <Link
            href="/members"
            className="transform transition-colors hover:scale-105 hover:text-accent"
          >
            Members
          </Link>
          <Link
            href="/events"
            className="transform transition-colors hover:scale-105 hover:text-accent"
          >
            Events
          </Link>

          {isAuthed && (
            <Link
              href="/profile"
              className="transform transition-colors hover:scale-105 hover:text-accent"
            >
              My Profile
            </Link>
          )}
        </nav>

        <div className="flex gap-3 py-4">
          {[
            {
              Icon: XLogoIcon,
              href: "https://x.com/sva_utd",
              label: "X",
            },
            {
              Icon: Instagram,
              href: "https://www.instagram.com/sva.utd/",
              label: "Instagram",
            },
          ].map(({ Icon, href, label }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={label}
              className="group"
            >
              <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 340, damping: 26 }}
                className="h-12 w-12 rounded-full border border-border/80 bg-gradient-to-b from-white/30 to-black/10 p-[1px] shadow-[0_6px_8px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_12px_20px_rgba(0,0,0,0.12)]"
              >
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-secondary/70 backdrop-blur">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/18 via-transparent to-transparent opacity-70" />

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-colors duration-300 group-hover:bg-accent">
                    <Icon className="h-6 w-6 text-muted-foreground transition-all group-hover:scale-105 group-hover:text-white" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="space-y-3">
          <p className="whitespace-nowrap text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
            UTD Student Veterans Association.
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
            All rights reserved. ©{currentYear} SVA | UTDallas.
          </p>
        </div>
      </div>
    </footer>
  );
}