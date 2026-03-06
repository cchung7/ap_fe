// D:\ap_fe\src\components\home\ContactSection.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Loader2,
  Mail,
  MapPin,
  Rocket,
  Instagram,
  Phone,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

const BACKEND_URL = "https://api.jayportfolio.me/contact";

export const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      body: formData.get("body"),
    };

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast.success("Message received — we’ll be in touch soon.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Unable to send right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-8 md:py-12 pb-28 md:pb-36 px-6 bg-background"
    >
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="space-y-3 flex flex-col items-center text-center">
            <div className="space-y-5 flex flex-col items-center text-center">
              <h2 className="text-sm font-black uppercase tracking-[0.45em] text-accent">
                Connect
              </h2>

              {/* Section title */}
              <h3
                className="
                  ui-title
                  leading-[1.05]
                  tracking-tight
                  text-primary/80
                  italic
                  [text-shadow:0_4px_12px_rgba(0,0,0,0.22)]
                  text-[2.35rem]
                  sm:text-5xl
                  md:text-[3.2rem]
                  lg:text-6xl
                "
              >
                Lead with purpose
              </h3>

              {/* Standardized body */}
              <p className="ui-body text-muted-foreground max-w-xl mx-auto font-medium">
                The Student Veterans Association supports UT Dallas
                military-connected students through advocacy, mentorship, and
                campus community. Reach out with questions, ideas, or ways you’d
                like to get involved.
              </p>
            </div>

            <div className="pt-6 w-full max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    icon: Instagram,
                    label: "Instagram",
                    value: "@sva.utd",
                    href: "https://www.instagram.com/sva.utd/?hl=en",
                    newTab: true,
                  },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target={item.newTab ? "_blank" : undefined}
                    rel={item.newTab ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-3xl border border-border/70 bg-secondary/30 px-5 py-4 text-left transition-all duration-300 hover:border-accent/70 hover:shadow-lg hover:shadow-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-secondary flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                      <item.icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">
                        {item.label}
                      </p>
                      <p className="text-base sm:text-lg font-bold tracking-tight truncate">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form Side (now below the header/info) */}
          <div className="bg-secondary/30 p-8 md:p-20 rounded-[2.5rem] border border-border/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-all duration-1000">
              <Rocket className="h-16 w-16" />
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
              <div className="space-y-6">
                <div className="space-y-2 border-b-2 border-border/60 focus-within:border-accent transition-colors pb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                    Full Name
                  </label>
                  <input
                    required
                    name="fullName"
                    type="text"
                    placeholder="Your name"
                    className="w-full bg-transparent border-none p-2 text-xl font-bold placeholder:text-muted-foreground/20 focus:ring-0"
                  />
                </div>

                <div className="space-y-2 border-b-2 border-border/60 focus-within:border-accent transition-colors pb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                    Email Address
                  </label>
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="you@utdallas.edu"
                    className="w-full bg-transparent border-none p-2 text-xl font-bold placeholder:text-muted-foreground/20 focus:ring-0"
                  />
                </div>

                <div className="space-y-2 border-b-2 border-border/60 focus-within:border-accent transition-colors pb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                    Message
                  </label>
                  <textarea
                    required
                    name="body"
                    placeholder="How can we help?"
                    className="w-full bg-transparent border-none p-2 text-xl font-bold placeholder:text-muted-foreground/20 focus:ring-0 min-h-32"
                  />
                </div>
              </div>

              <Button
                disabled={isSubmitting}
                className="w-full h-14 cursor-pointer rounded-full bg-primary text-primary-foreground font-black uppercase tracking-[0.25em] text-sm group shadow-xl transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-white"
              >
                {isSubmitting ? (
                  <>
                    Sending <Loader2 className="ml-2 animate-spin" size={16} />
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight
                      size={16}
                      className="ml-2 transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};