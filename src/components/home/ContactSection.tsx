"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Loader2,
  Mail,
  MapPin,
  Rocket,
  Twitter,
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

      toast.success("Dispatch Sent! We'll be in touch soon.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Failed to connect to server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-8 md:py-12 px-6 bg-background">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Contact Info Side */}
          <div className="lg:col-span-5 space-y-3">
            <div className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.5em] text-accent">
                Availability
              </h2>
              <h3 className="text-5xl font-black tracking-tighter italic leading-tight">
                Lets build <br /> the future.
              </h3>
              <p className="text-lg text-muted-foreground font-medium max-w-sm leading-relaxed">
                Currently accepting select architectural commissions and
                performance-driven engineering collaborations.
              </p>
            </div>

            <div className="space-y-6 pt-6">
              {[
                {
                  icon: Mail,
                  label: "Digital Mail",
                  value: "hello@example.dev",
                },
                {
                  icon: Twitter,
                  label: "Dispatch Briefs",
                  value: "@sva_utd",
                },
                {
                  icon: MapPin,
                  label: "Headquarters",
                  value: "San Francisco, CA",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-6 group cursor-pointer"
                >
                  <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all transform group-hover:scale-105 active:scale-95 duration-500 shadow-minimal group-hover:shadow-xl">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/50">
                      {item.label}
                    </p>
                    <p className="text-lg font-bold tracking-tight">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 bg-secondary/30 p-8 md:p-20 rounded-[2.5rem] border border-border/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-all duration-1000">
              <Rocket className="h-16 w-16" />
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
              <div className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2 border-b-2 border-border/60 focus-within:border-accent transition-colors pb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                    Full Name
                  </label>
                  <input
                    required
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-transparent border-none p-2 text-xl font-bold placeholder:text-muted-foreground/20 focus:ring-0  "
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2 border-b-2 border-border/60 focus-within:border-accent transition-colors pb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                    Email Address
                  </label>
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-transparent border-none p-2 text-xl font-bold placeholder:text-muted-foreground/20 focus:ring-0 "
                  />
                </div>

                {/* Body (Message) Input */}
                <div className="space-y-2 border-b-2 border-border/60 focus-within:border-accent transition-colors pb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                    Project Brief
                  </label>
                  <textarea
                    required
                    name="body"
                    placeholder="The vision..."
                    className="w-full bg-transparent border-none p-2 text-xl font-bold placeholder:text-muted-foreground/20 focus:ring-0  min-h-32 "
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                disabled={isSubmitting}
                className="w-full h-14 cursor-pointer rounded-full bg-primary text-primary-foreground font-black uppercase tracking-[0.25em] text-sm group shadow-xl transition-all hover:bg-accent hover:text-white"
              >
                {isSubmitting ? (
                  <>
                    Processing{" "}
                    <Loader2 className="ml-2 animate-spin" size={16} />
                  </>
                ) : (
                  <>
                    Send Dispatch{" "}
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
