// D:\ap_fe\src\components\members\MemberCard.tsx
// Per-card presentation + interaction UX
"use client";

import * as React from "react";
import type { UserWithPoints } from "@/types/userWithPoints";
import { ProfileBadge } from "@/components/ui/ProfileBadge";

export function MemberCard({
  user,
  isLeadership = false,
}: {
  user: UserWithPoints;
  isLeadership?: boolean;
}) {
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const nameRef = React.useRef<HTMLDivElement | null>(null);

  const [nameFontPx, setNameFontPx] = React.useState(18); // ~text-lg

  const fitNameToTwoLines = React.useCallback(() => {
    const el = nameRef.current;
    if (!el) return;

    const BASE = 18;
    const MIN = 13;

    el.style.fontSize = `${BASE}px`;

    const computeLines = () => {
      const cs = window.getComputedStyle(el);
      const fontSize = parseFloat(cs.fontSize || `${BASE}`);
      const lhRaw = cs.lineHeight;

      const lineHeight =
        lhRaw && lhRaw !== "normal" ? parseFloat(lhRaw) : fontSize * 1.2;

      const height = el.getBoundingClientRect().height;
      return height / lineHeight;
    };

    let lines = computeLines();
    if (lines <= 2.05) {
      setNameFontPx(BASE);
      return;
    }

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
    fitNameToTwoLines();
  }, [fitNameToTwoLines, user?.name]);

  React.useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => fitNameToTwoLines());
    });

    ro.observe(card);
    return () => ro.disconnect();
  }, [fitNameToTwoLines]);

  // flag.png = red/white/blue
  // flag2.png = gold/white
  // flag3.png = silver/white
  const flagBg = isLeadership
    ? "/backgrounds/flag.png"
    : "/backgrounds/flag3.png";

  // Background Opacity (... ? Leadership : Membership)
  const flagOpacity = isLeadership ? 0.16 : 0.35;

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

        transform-gpu
        transition-all
        duration-300
        ease-out

        shadow-master
        hover:-translate-y-[4px]
        hover:shadow-hover
      "
      style={{ borderRadius: "1rem" }}
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

      {/* Flag background */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          rounded-2xl
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage: `url('${flagBg}')`,
          opacity: flagOpacity,
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 min-w-0 space-y-3 text-center">
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