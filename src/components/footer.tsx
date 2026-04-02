"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { FaDiscord } from "react-icons/fa";
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
    <footer className="w-full border-t border-border/40 bg-secondary/30 py-6 sm:py-7">
      <div className="ui-page-shell">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-3 text-center">
          <div className="group flex flex-col items-center gap-3">
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

            <h4 className="ui-title font-heading text-xl uppercase italic tracking-tighter sm:text-2xl">
              <span className="text-muted-foreground/60">
                SVA- UT-Dallas
              </span>
            </h4>
          </div>

          <nav className="mt-1 flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-black uppercase tracking-[0.16em] text-foreground/75 sm:text-[13px] sm:tracking-[0.2em]">
            <Link
              href="/"
              className="border-b border-transparent pb-0.5 transition-all duration-200 hover:border-accent/50 hover:text-accent"
            >
              Home
            </Link>
            <Link
              href="/members"
              className="border-b border-transparent pb-0.5 transition-all duration-200 hover:border-accent/50 hover:text-accent"
            >
              Members
            </Link>
            <Link
              href="/events"
              className="border-b border-transparent pb-0.5 transition-all duration-200 hover:border-accent/50 hover:text-accent"
            >
              Events
            </Link>

            {isAuthed && (
              <Link
                href="/profile"
                className="border-b border-transparent pb-0.5 transition-all duration-200 hover:border-accent/50 hover:text-accent"
              >
                My Profile
              </Link>
            )}
          </nav>

          <div className="flex gap-3 py-3">
            {[
              {
                Icon: Instagram,
                href: "https://www.instagram.com/sva.utd/",
                label: "Instagram",
              },
              {
                Icon: FaDiscord,
                href: "https://discord.gg/xKRJKJjk5g",
                label: "Discord",
              },
              {
                Icon: XLogoIcon,
                href: "https://x.com/sva_utd",
                label: "X",
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
                  className="ui-social-shell"
                >
                  <div className="ui-social-core">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/18 via-transparent to-transparent opacity-70" />
                    <Icon className="ui-social-icon relative z-10 h-6 w-6" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="max-w-full space-y-2">
            <p className="ui-eyebrow break-words text-center text-muted-foreground/60">
              The Student Veterans of America Association | UT-Dallas Chapter
            </p>
            <p className="ui-eyebrow text-[10px] font-semibold text-muted-foreground/40">
              All rights reserved. ©{currentYear} SVA- UT-DALLAS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}