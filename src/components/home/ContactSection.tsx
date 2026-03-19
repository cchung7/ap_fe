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
      className="pt-20 md:pt-28 pb-28 md:pb-36 px-6 bg-background"
    >
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col gap-8 md:gap-10">
          <div className="space-y-3 flex flex-col items-center text-center">
            <div className="space-y-5 flex flex-col items-center text-center">
              <h2 className="text-sm font-black uppercase tracking-[0.45em] text-accent">
                Connect
              </h2>

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

              <p className="ui-body text-muted-foreground max-w-xl mx-auto font-medium">
                The Student Veterans Association supports UT Dallas
                military-connected students through advocacy, mentorship, and
                campus community. Reach out with questions, ideas, or ways you’d
                like to get involved.
              </p>
            </div>

            <div className="pt-6 w-full max-w-[42rem] mx-auto">
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
                    className="ui-surface-brand group relative flex items-center gap-4 rounded-3xl px-5 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-[0_22px_50px_-24px_rgba(11,18,32,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <div
                      className="
                        ui-surface-silver
                        relative z-10 h-12 w-12 shrink-0 rounded-2xl
                        flex items-center justify-center
                        text-primary
                        transition-all duration-300
                        group-hover:text-accent
                      "
                    >
                      <item.icon className="relative z-10 h-5 w-5" />
                    </div>

                    <div className="relative z-10 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/75">
                        {item.label}
                      </p>
                      <p className="text-base sm:text-lg font-bold tracking-tight text-foreground/85 truncate">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full max-w-[30rem] mx-auto">
            <div className="ui-surface-brand relative rounded-[2.5rem]">
              <div className="absolute top-0 right-0 p-5 opacity-[0.07] scale-[1.35] rotate-12 pointer-events-none">
                <Rocket className="h-20 w-20 text-primary" />
              </div>

              <div className="relative z-10 p-6 sm:p-7 md:p-8">
                <div className="mb-6 space-y-2 text-left">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">
                    Contact Form
                  </p>
                  <h4 className="text-2xl font-black tracking-tight text-foreground">
                    Send a Message
                  </h4>
                  <p className="text-sm font-medium text-muted-foreground">
                    Share a question, idea, or request and our team will follow
                    up as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <div className="ui-surface-silver rounded-3xl border border-slate-500/25 p-4 sm:p-5 transition-all focus-within:border-accent/35 focus-within:ring-2 focus-within:ring-accent/15">
                      <label className="relative z-10 ml-1 block text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground/80">
                        Full Name
                      </label>
                      <div className="relative z-10 mt-3 rounded-2xl border border-slate-400/30 bg-white/35 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.32)]">
                        <input
                          required
                          name="fullName"
                          type="text"
                          placeholder="Your name"
                          className="w-full bg-transparent border-none p-0 text-sm sm:text-base font-bold text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>

                    <div className="ui-surface-silver rounded-3xl border border-slate-500/25 p-4 sm:p-5 transition-all focus-within:border-accent/35 focus-within:ring-2 focus-within:ring-accent/15">
                      <label className="relative z-10 ml-1 block text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground/80">
                        Email Address
                      </label>
                      <div className="relative z-10 mt-3 rounded-2xl border border-slate-400/30 bg-white/35 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.32)]">
                        <input
                          required
                          name="email"
                          type="email"
                          placeholder="netid@utdallas.edu"
                          className="w-full bg-transparent border-none p-0 text-sm sm:text-base font-bold text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>

                    <div className="ui-surface-silver rounded-3xl border border-slate-500/25 p-4 sm:p-5 transition-all focus-within:border-accent/35 focus-within:ring-2 focus-within:ring-accent/15">
                      <label className="relative z-10 ml-1 block text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground/80">
                        Message
                      </label>
                      <div className="relative z-10 mt-3 rounded-2xl border border-slate-400/30 bg-white/35 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.32)]">
                        <textarea
                          required
                          name="body"
                          placeholder="How can we help?"
                          className="w-full min-h-36 resize-none bg-transparent border-none p-0 text-sm sm:text-base font-bold text-foreground placeholder:text-muted-foreground/45 focus:outline-none focus:ring-0"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full h-14 cursor-pointer rounded-full text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] sm:tracking-[0.22em] shadow-xl transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-white"
                  >
                    {isSubmitting ? (
                      <>
                        Sending <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        <span className="truncate">
                          Send Message
                        </span>
                        <ArrowRight className="ml-2 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};