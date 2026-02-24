// src/components/data/hero-slides.ts

export type HeroSlide = {
  src: string;
  alt: string;
  emphasis?: "left" | "center" | "right";
};

export const heroSlides: HeroSlide[] = [
  {
    src: "/hero/sva_1.jpg",
    alt: "SVA community event",
    emphasis: "left",
  },
  {
    src: "/hero/sva_2.jpg",
    alt: "Student showcase",
    emphasis: "center",
  },
  {
    src: "/hero/sva_3.jpg",
    alt: "Workshop collaboration",
    emphasis: "right",
  },
];