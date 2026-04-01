"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Loader2,
  Mail,
  MapPin,
  Rocket,
  Instagram,
  Phone,
  Linkedin,
} from "lucide-react";
import { motion } from "framer-motion";
import * as React from "react";
import { FaDiscord } from "react-icons/fa";

import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";

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

const communityLinks = [
  {
    Icon: Instagram,
    href: "https://www.instagram.com/sva.utd/?hl=en",
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
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { showError, showSuccess } = useGlobalStatusBanner();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();

    if (!fullName) {
      showError("Please provide your full name.");
      return;
    }

    if (!email) {
      showError("Please provide your email address.");
      return;
    }

    if (!isValidEmail(email)) {
      showError("Please provide a valid email address.");
      return;
    }

    if (!body) {
      showError("Please enter a message before sending.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          body,
        }),
      });

      const json = await response.json().catch(() => null);

      if (!response.ok || !json?.success) {
        const message =
          json?.message ||
          json?.error ||
          "Failed to send message. Please try again later.";

        showError(message);
        return;
      }

      form.reset();
      showSuccess(json?.message || "Message sent successfully.");
    } catch (error) {
      console.error("Contact submission error:", error);
      showError("Unable to send right now. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="ui-home-section-terminal">
      <div className="ui-page-shell">
        <div className="ui-section-grid">
          <div className="lg:col-span-6">
            <div className="flex justify-center lg:justify-start lg:pl-10 xl:pl-12">
              <div className="w-full max-w-2xl space-y-6 text-center lg:max-w-[28rem] lg:text-left">
                <p className="ui-eyebrow">
                  Community Outreach
                </p>

                <h2 className="ui-title text-[2.35rem] sm:text-[2.55rem] md:text-[2.85rem] lg:text-[3rem] xl:text-[3.2rem]">
                  Contact Us
                </h2>

                <div className="mx-auto h-px w-full max-w-xl bg-border/70 lg:mx-0" />

                <p className="ui-section-body max-w-2xl">
                  Connecting student veterans, supporters, and community
                  leaders with resources and opportunities to get involved.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center lg:justify-start lg:pl-8 xl:pl-10">
              <div className="w-full max-w-2xl lg:max-w-[28rem]">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
                  {[
                    {
                      icon: Mail,
                      label: "Email",
                      value: "veterans@utdallas.edu",
                      href: "mailto:veterans@utdallas.edu",
                      newTab: false,
                    },
                    {
                      icon: Phone,
                      label: "Office",
                      value: "972-883-4913",
                      href: "tel:+19728834913",
                      newTab: false,
                    },
                    {
                      icon: MapPin,
                      label: "Location",
                      value: "SSA 14.250",
                      href: "https://map.concept3d.com/?id=1772#!m/544891?s/",
                      newTab: true,
                    },
                    {
                      icon: Linkedin,
                      label: "LinkedIn",
                      value: "@UT Dallas SVA",
                      href: "https://www.linkedin.com/groups/12150361/",
                      newTab: true,
                    },
                  ].map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      target={item.newTab ? "_blank" : undefined}
                      rel={item.newTab ? "noopener noreferrer" : undefined}
                      className="ui-surface-brand group relative flex items-center gap-4 rounded-[1.5rem] px-5 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-[0_22px_50px_-24px_rgba(11,18,32,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <div className="ui-surface-silver relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-primary transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                        <item.icon className="relative z-10 h-5 w-5 transition-all duration-300" />
                      </div>

                      <div className="relative z-10 min-w-0">
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-muted-foreground/75">
                          {item.label}
                        </p>
                        <p className="truncate text-base font-bold tracking-tight text-foreground/85 lg:text-[1.05rem]">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="mt-10 rounded-[1.75rem] border border-border/50 p-5 sm:p-6">
                  <div className="space-y-3 text-center lg:text-left">
                    <h3 className="ui-title text-[1.4rem] sm:text-[1.5rem]">
                      Connect-SVA:
                    </h3>

                    <p className="text-sm font-medium text-muted-foreground">
                      Follow updates, build community, and stay connected across
                      our official social platforms.
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap justify-center gap-3 lg:justify-start">
                    {communityLinks.map(({ Icon, href, label }) => (
                      <Link
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={label}
                        aria-label={label}
                        className="group"
                      >
                        <motion.div
                          whileHover={{ y: -2, scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{
                            type: "spring",
                            stiffness: 340,
                            damping: 26,
                          }}
                          className="h-12 w-12 rounded-full border border-border/80 bg-gradient-to-b from-white/30 to-black/10 p-[1px] shadow-[0_6px_8px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_12px_20px_rgba(0,0,0,0.06)]"
                        >
                          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full ui-surface-silver backdrop-blur transition-colors duration-300 group-hover:bg-accent">
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/18 via-transparent to-transparent opacity-70" />
                            <Icon className="relative z-10 h-6 w-6 text-muted-foreground transition-all duration-300 group-hover:scale-105 group-hover:text-white" />
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="ui-right-module">
              <div className="ui-surface-brand relative rounded-[2.5rem]">
                <div className="pointer-events-none absolute right-0 top-0 scale-[1.35] rotate-12 p-5 opacity-[0.07]">
                  <Rocket className="h-20 w-20 text-primary" />
                </div>

                <div className="relative z-10 p-6 sm:p-7 md:p-8 lg:p-9">
                  <div className="mb-5 space-y-3 text-center lg:text-left">
                    <h3 className="ui-title text-[1.4rem] sm:text-[1.5rem]">
                      Send a Message:
                    </h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="space-y-4">
                      <div className="ui-surface-silver rounded-3xl border border-slate-500/25 p-4 sm:p-5 transition-all focus-within:border-accent/35 focus-within:ring-2 focus-within:ring-accent/15">
                        <label className="relative z-10 ml-1 block text-[11px] font-black uppercase tracking-[0.24em] text-muted-foreground/80">
                          Full Name
                        </label>
                        <div className="relative z-10 mt-3 rounded-2xl border border-slate-400/30 bg-white/35 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.32)]">
                          <input
                            required
                            name="fullName"
                            type="text"
                            placeholder="Your name"
                            autoComplete="name"
                            className="w-full border-none bg-transparent p-0 text-base font-bold text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-0"
                          />
                        </div>
                      </div>

                      <div className="ui-surface-silver rounded-3xl border border-slate-500/25 p-4 sm:p-5 transition-all focus-within:border-accent/35 focus-within:ring-2 focus-within:ring-accent/15">
                        <label className="relative z-10 ml-1 block text-[11px] font-black uppercase tracking-[0.24em] text-muted-foreground/80">
                          Email Address
                        </label>
                        <div className="relative z-10 mt-3 rounded-2xl border border-slate-400/30 bg-white/35 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.32)]">
                          <input
                            required
                            name="email"
                            type="email"
                            placeholder="netid@utdallas.edu"
                            autoComplete="email"
                            className="w-full border-none bg-transparent p-0 text-base font-bold text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-0"
                          />
                        </div>
                      </div>

                      <div className="ui-surface-silver rounded-3xl border border-slate-500/25 p-4 sm:p-5 transition-all focus-within:border-accent/35 focus-within:ring-2 focus-within:ring-accent/15">
                        <label className="relative z-10 ml-1 block text-[11px] font-black uppercase tracking-[0.24em] text-muted-foreground/80">
                          Message
                        </label>
                        <div className="relative z-10 mt-3 rounded-2xl border border-slate-400/30 bg-white/35 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.32)]">
                          <textarea
                            required
                            name="body"
                            placeholder="How can we help?"
                            className="min-h-36 w-full resize-none border-none bg-transparent p-0 text-base font-bold text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-0"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="h-14 w-full cursor-pointer rounded-full text-[12px] font-black uppercase tracking-[0.18em] shadow-xl transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-75 sm:text-[13px] sm:tracking-[0.22em]"
                    >
                      {isSubmitting ? (
                        <>
                          Sending{" "}
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          <span className="truncate">Send Message</span>
                          <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};