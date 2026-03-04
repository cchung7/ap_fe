// src/components/members/MemberCard.tsx
import type { UserWithPoints } from "@/types/userWithPoints";

export function MemberCard({ user }: { user: UserWithPoints }) {
  return (
    <div
      className="
        group
        relative
        w-full max-w-[520px] mx-auto
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
        {/* Top badges row */}
        {(user.subRole || user.academicYear) && (
          <div className="flex justify-center gap-2 flex-wrap">
            {/* Sub-role badge */}
            {user.subRole && (
              <span
                className="
                  inline-flex items-center
                  rounded-full
                  px-3 py-1
                  text-[11px] font-black uppercase tracking-widest
                  text-white
                  bg-[var(--accent)]/60
                  border border-[var(--accent)]/30
                  backdrop-blur-sm
                "
              >
                {user.subRole}
              </span>
            )}

            {/* Academic year badge */}
            {user.academicYear && (
              <span
                className="
                  inline-flex items-center
                  rounded-full
                  px-3 py-1
                  text-[11px] font-black uppercase tracking-widest
                  text-white
                  bg-[var(--primary)]/60
                  border border-[var(--primary)]/30
                  backdrop-blur-sm
                "
              >
                {user.academicYear}
              </span>
            )}
          </div>
        )}

        {/* Name + points */}
        <div className="text-lg font-black leading-tight break-words">
          {user.name}{" "}
          <span className="font-semibold text-muted-foreground">
            · {user.pointsTotal} pts
          </span>
        </div>

        {/* Email */}
        <div className="text-sm text-muted-foreground break-words">
          {user.email}
        </div>

        {/* Major */}
        {user.major && (
          <div className="text-xs text-muted-foreground break-words">
            {user.major}
          </div>
        )}
      </div>
    </div>
  );
}