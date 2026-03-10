// D:\ap_fe\src\components\footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Linkedin, Instagram } from "lucide-react";
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
      {/* Simple "X" mark resembling the X logo */}
      <path d="M18.9 2H22l-6.9 7.9L23 22h-6.6l-5.2-6.7L5.4 22H2.2l7.4-8.6L1 2h6.8l4.7 6.1L18.9 2Zm-1.2 18h1.7L6.9 3.9H5.1L17.7 20Z" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { isAuthed } = useMe();

  return (
    <footer className="w-full bg-secondary/30 border-t border-border/40 py-6 px-6">
      <div className="container max-w-6xl mx-auto flex flex-col items-center gap-3 text-center">
        {/* Brand */}
        <div className="flex flex-col items-center gap-1 group">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* LOGO CONTAINER */}
            <div className="relative h-14 w-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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

          <h4 className="font-heading font-black text-2xl tracking-tighter uppercase italic text-foreground">
            <span className="text-muted-foreground/60">
              SVA- UT-Dallas
            </span>
          </h4>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">
          <Link
            href="/"
            className="hover:text-accent transition-colors hover:scale-105 transform"
          >
            Home
          </Link>
          <Link
            href="/members"
            className="hover:text-accent transition-colors hover:scale-105 transform"
          >
            Members
          </Link>
          <Link
            href="/events"
            className="hover:text-accent transition-colors hover:scale-105 transform"
          >
            Events
          </Link>

          {isAuthed && (
            <Link
              href="/profile"
              className="hover:text-accent transition-colors hover:scale-105 transform"
            >
              My Profile
            </Link>
          )}
        </nav>

        {/* Socials */}
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
              {/* 3D Button Shell */}
              <motion.div
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 340, damping: 26 }}
                className="h-12 w-12 rounded-full p-[1px] bg-gradient-to-b from-white/30 to-black/10 border border-border/80 shadow-[0_6px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_20px_rgba(0,0,0,0.12)] transition-shadow"
              >
                {/* Inner Face */}
                <div className="h-full w-full rounded-full bg-secondary/70 backdrop-blur flex items-center justify-center relative overflow-hidden">
                  {/* subtle sheen */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/18 via-transparent to-transparent opacity-70" />

                  {/* icon */}
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center transition-colors duration-300 group-hover:bg-accent">
                    <Icon className="h-6 w-6 text-muted-foreground group-hover:text-white transition-all group-hover:scale-105" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest whitespace-nowrap">
            UTD Student Veterans Association.
          </p>
          <p className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-widest">
            All rights reserved. ©{currentYear} SVA | UTDallas.
          </p>
        </div>
      </div>
    </footer>
  );
}