"use client";

import * as React from "react";

import { AboutSection } from "@/components/home/AboutSection";
import { CarouselSection } from "@/components/home/CarouselSection";
import { ContactSection } from "@/components/home/ContactSection";
import { HeroSection } from "@/components/home/HeroSection";
import { QuoteSection } from "@/components/home/QuoteSection";
import { UpcomingEventsSection } from "@/components/home/UpcomingEventsSection";

export default function Home() {
  return (
    <div className="flex w-full flex-col overflow-hidden bg-background">
      <HeroSection />
      <AboutSection />
      <UpcomingEventsSection />
      <CarouselSection />
      <ContactSection />
      <QuoteSection />
    </div>
  );
}