// D:\ap_fe\src\components\members\MemberCard.tsx
"use client";

import * as React from "react";
import type { UserWithPoints } from "@/types/userWithPoints";
import { ProfileBadge } from "@/components/ui/ProfileBadge";

export function MemberCard({ user }: { user: UserWithPoints }) {
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const nameRef = React.useRef<HTMLDivElement | null>(null);

  const [nameFontPx, setNameFontPx] = React.useState(18); // ~text-lg

  const fitNameToTwoLines = React.useCallback(() => {
    const el = nameRef.current;
    if (!el) return;

    // Reset to base size first, then shrink if needed.
    const BASE = 18;
    const MIN = 13;

    // Apply base immediately for accurate measure.
    el.style.fontSize = `${BASE}px`;

    // Measure line count using computed line-height.
    const computeLines = () => {
      const cs = window.getComputedStyle(el);
      const fontSize = parseFloat(cs.fontSize || `${BASE}`);
      const lhRaw = cs.lineHeight;

      // lineHeight can be "normal" -> approximate
      const lineHeight =
        lhRaw && lhRaw !== "normal" ? parseFloat(lhRaw) : fontSize * 1.2;

      const height = el.getBoundingClientRect().height;
      return height / lineHeight;
    };

    // If it already fits, keep base.
    let lines = computeLines();
    if (lines <= 2.05) {
      setNameFontPx(BASE);
      return;
    }

    // Shrink in small steps until it fits (or hits MIN).
    let px = BASE;
    while (px > MIN) {
      px -= 1;
      el.style.fontSize = `${px}px`;
      lines = computeLines();
      if (lines <= 2.05) break;
    }

    setNameFontPx(px);
  }, []);

  React.useLayoutEffect(() => {
    // Initial fit after mount / content change
    fitNameToTwoLines();
  }, [fitNameToTwoLines, user?.name]);

  React.useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ro = new ResizeObserver(() => {
      // Re-fit on width changes (window resize, grid changes, etc.)
      // Use rAF to avoid ResizeObserver loop warnings in some browsers.
      requestAnimationFrame(() => fitNameToTwoLines());
    });

    ro.observe(card);
    return () => ro.disconnect();
  }, [fitNameToTwoLines]);

  return (
    <div
      ref={cardRef}
      className="
        group
        relative
        w-full
        max-w-[460px]
        mx-auto
        rounded-2xl
        border
        bg-card
        p-5
        overflow-hidden

        /* Depth + smoothness */
        transform-gpu
        transition-all
        duration-300
        ease-out

        /* Base shadow */
        shadow-master

        /* Hover lift (keeps rounding stable) */
        hover:-translate-y-[4px]

        /* Hover shadow */
        hover:shadow-hover
      "
      style={{ borderRadius: "1rem" }} /* hard-lock rounding during GPU transform */
    >
      {/* Subtle glow layer */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          rounded-2xl
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100

          bg-[radial-gradient(ellipse_at_top,rgba(177,18,38,0.18),transparent_65%)]
        "
        aria-hidden
      />

      {/* Very-transparent American flag background */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          rounded-2xl
          bg-[url('/backgrounds/flag.png')]
          bg-cover
          bg-center
          bg-no-repeat
          opacity-[0.20]
        "
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 min-w-0 space-y-3 text-center">
        {/* Name (auto-shrinks to fit within 2 lines) */}
        <div
          ref={nameRef}
          className="
            font-black
            leading-tight
            max-w-full
            break-words
          "
          style={{ fontSize: `${nameFontPx}px` }}
        >
          {user.name}
        </div>

        {/* Email (stronger + cleaner, still subdued) */}
        <div
          className="
            text-[13px]
            font-semibold
            tracking-tight
            text-foreground/70
            break-words
            underline
            underline-offset-4
            decoration-border/70
          "
        >
          {user.email}
        </div>

        {/* Badges row (below email) */}
        {(user.subRole || user.academicYear || user.major) && (
          <div className="flex justify-center gap-2 flex-wrap">
            {user.subRole && (
              <ProfileBadge variant="subRole">{user.subRole}</ProfileBadge>
            )}

            {user.academicYear && (
              <ProfileBadge variant="academicYear">
                {user.academicYear}
              </ProfileBadge>
            )}

            {user.major && (
              <ProfileBadge variant="major" title={user.major}>
                {user.major}
              </ProfileBadge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}