"use client";

import * as React from "react";

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
  if (!message) return null;

  const base =
    "w-full rounded-sm border px-4 py-3 text-center text-base font-bold shadow-lg backdrop-blur-sm";

  const variantClass =
    variant === "error"
      ? "border-red-800/60 bg-red-950/85 text-white"
      : variant === "success"
      ? "border-green-800/60 bg-green-950/85 text-white"
      : "border-sky-800/60 bg-sky-950/85 text-white";

  return <div className={`${base} ${variantClass} ${className}`}>{message}</div>;
}

export function GlobalStatusBannerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [banner, setBanner] = React.useState<BannerState>(null);

  const clear = React.useCallback(() => setBanner(null), []);

  const showError = React.useCallback((msg: string) => {
    setBanner({ variant: "error", message: msg });
  }, []);

  const showSuccess = React.useCallback((msg: string) => {
    setBanner({ variant: "success", message: msg });
  }, []);

  const showInfo = React.useCallback((msg: string) => {
    setBanner({ variant: "info", message: msg });
  }, []);

  return (
    <GlobalStatusBannerContext.Provider
      value={{ showError, showSuccess, showInfo, clear }}
    >
      {/* Global lane: always viewport-fixed */}
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

      {children}
    </GlobalStatusBannerContext.Provider>
  );
}