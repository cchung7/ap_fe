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
    <section id="contact" className="ui-section-shell pb-28 md:pb-36">
      <div className="ui-page-shell">
        <div className="ui-section-grid">
          <div className="lg:col-span-6">
            <div className="mx-auto max-w-2xl space-y-6 text-center lg:mx-0 lg:text-left">
              <p className="ui-eyebrow text-accent">
                Our Community
              </p>

              <h2 className="ui-title text-primary/85">
                Contact Us
              </h2>

              <div className="mx-auto h-px w-full max-w-xl bg-border/70 lg:mx-0" />

              <p className="ui-section-body max-w-2xl">
                Connecting military-connected students and supporters with advocacy, resources, 
                and opportunities to get involved.
              </p>
            </div>

            <div className="mt-8 w-full">
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
                    className="ui-surface-brand group relative flex items-center gap-4 rounded-[1.5rem] px-5 py-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-[0_22px_50px_-24px_rgba(11,18,32,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <div className="ui-surface-silver relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-primary transition-all duration-300 group-hover:text-accent">
                      <item.icon className="relative z-10 h-5 w-5" />
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
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="ui-right-module">
              <div className="ui-surface-brand relative rounded-[2.5rem]">
                <div className="pointer-events-none absolute right-0 top-0 scale-[1.35] rotate-12 p-5 opacity-[0.07]">
                  <Rocket className="h-20 w-20 text-primary" />
                </div>

                <div className="relative z-10 p-6 sm:p-7 md:p-8 lg:p-9">
                  <div className="mb-7 space-y-3 text-left">
                    <p className="ui-eyebrow text-muted-foreground">
                      Contact Form
                    </p>
                    <h3 className="ui-title text-3xl">Send a Message</h3>
                    <p className="text-base font-medium text-muted-foreground">
                      Contact us, and our team will follow up shortly.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
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
                      className="h-14 w-full cursor-pointer rounded-full text-[12px] font-black uppercase tracking-[0.18em] shadow-xl transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-white sm:text-[13px] sm:tracking-[0.22em]"
                    >
                      {isSubmitting ? (
                        <>
                          Sending <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          <span className="truncate">Send Message</span>
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
      </div>
    </section>
  );
};