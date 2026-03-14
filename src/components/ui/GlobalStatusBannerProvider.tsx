"use client";

import * as React from "react";
import { createPortal } from "react-dom";

type BannerVariant = "error" | "success" | "info";

type BannerState = {
  variant: BannerVariant;
  message: string;
} | null;

type GlobalStatusBannerContextValue = {
  showError: (msg: string) => void;
  showSuccess: (msg: string) => void;
  showInfo: (msg: string) => void;
  clear: () => void;
};

const GlobalStatusBannerContext =
  React.createContext<GlobalStatusBannerContextValue | null>(null);

export function useGlobalStatusBanner() {
  const ctx = React.useContext(GlobalStatusBannerContext);
  if (!ctx) {
    throw new Error(
      "useGlobalStatusBanner must be used within GlobalStatusBannerProvider"
    );
  }
  return ctx;
}

function StatusBanner({
  variant,
  message,
  className = "",
}: {
  variant: BannerVariant;
  message: string;
  className?: string;
}) {
  const text = (message || "").trim();
  if (!text) return null;

  const label =
    variant === "error"
      ? "Error"
      : variant === "success"
      ? "Success"
      : "Notice";

  const stripe =
    variant === "error"
      ? "bg-red-500"
      : variant === "success"
      ? "bg-emerald-500"
      : "bg-sky-500";

  const icon =
    variant === "error"
      ? "!"
      : variant === "success"
      ? "✓"
      : "i";

  return (
    <div
      className={[
        // standout + professional surface
        "relative w-full overflow-hidden rounded-2xl border",
        "px-5 py-4 md:px-6 md:py-4.5",
        "shadow-[0_18px_45px_rgba(0,0,0,0.35)] ring-1",
        "backdrop-blur-md",
        "bg-white/95 text-slate-950 border-black/12 ring-black/10",
        "dark:bg-slate-950/90 dark:text-slate-50 dark:border-white/14 dark:ring-white/12",
        // subtle “slide in” cue (no framer needed)
        "animate-[bannerIn_160ms_ease-out]",
        className,
      ].join(" ")}
    >
      {/* thicker accent stripe */}
      <div className={`absolute left-0 top-0 h-full w-2.5 ${stripe}`} />

      <div className="flex items-start gap-3 pl-3">
        {/* icon chip */}
        <div
          className={[
            "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center",
            "rounded-xl font-black",
            stripe,
            "text-white shadow-sm",
          ].join(" ")}
          aria-hidden="true"
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-[0.72rem] md:text-[0.78rem] font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">
            {label}
          </div>
          <div className="mt-1 text-[0.98rem] md:text-[1.02rem] leading-snug">
            {text}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bannerIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export function GlobalStatusBannerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [banner, setBanner] = React.useState<BannerState>(null);
  const [mounted, setMounted] = React.useState(false);

  const dismissTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => setMounted(true), []);

  const clear = React.useCallback(() => {
    if (dismissTimerRef.current != null) {
      window.clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    setBanner(null);
  }, []);

  const show = React.useCallback(
    (variant: BannerVariant, msg: string) => {
      const next = (msg || "").trim();
      if (!next) return;

      // Reset timer and show banner
      if (dismissTimerRef.current != null) {
        window.clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }

      setBanner({ variant, message: next });

      // Auto-dismiss after 4 seconds
      dismissTimerRef.current = window.setTimeout(() => {
        dismissTimerRef.current = null;
        setBanner(null);
      }, 4000);
    },
    []
  );

  const showError = React.useCallback((msg: string) => show("error", msg), [show]);
  const showSuccess = React.useCallback((msg: string) => show("success", msg), [show]);
  const showInfo = React.useCallback((msg: string) => show("info", msg), [show]);

  // Dismiss when user interacts with any form / input controls
  React.useEffect(() => {
    const shouldClear = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;

      // If they click anywhere inside a form, clear.
      if (target.closest("form")) return true;

      // If they interact with typical form controls, clear.
      const tag = target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || tag === "button") {
        return true;
      }

      // Also handle clicks on elements that are *inside* a control wrapper.
      if (target.closest("input, textarea, select, button")) return true;

      return false;
    };

    const onPointerDownCapture = (e: Event) => {
      if (!banner) return;
      if (shouldClear(e.target)) clear();
    };

    const onFocusInCapture = (e: Event) => {
      if (!banner) return;
      if (shouldClear(e.target)) clear();
    };

    window.addEventListener("pointerdown", onPointerDownCapture, true);
    window.addEventListener("focusin", onFocusInCapture, true);

    return () => {
      window.removeEventListener("pointerdown", onPointerDownCapture, true);
      window.removeEventListener("focusin", onFocusInCapture, true);
    };
  }, [banner, clear]);

  // Clean up timer on unmount
  React.useEffect(() => {
    return () => {
      if (dismissTimerRef.current != null) {
        window.clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
    };
  }, []);

  const overlay = (
    <div className="fixed inset-x-0 top-4 z-[9999] flex justify-center px-4 pointer-events-none">
      <div className="w-full max-w-3xl space-y-2 pointer-events-auto">
        <StatusBanner
          variant="error"
          message={banner?.variant === "error" ? banner.message : ""}
        />
        <StatusBanner
          variant="success"
          message={banner?.variant === "success" ? banner.message : ""}
        />
        <StatusBanner
          variant="info"
          message={banner?.variant === "info" ? banner.message : ""}
        />
      </div>
    </div>
  );

  return (
    <GlobalStatusBannerContext.Provider
      value={{ showError, showSuccess, showInfo, clear }}
    >
      {mounted ? createPortal(overlay, document.body) : null}
      {children}
    </GlobalStatusBannerContext.Provider>
  );
}