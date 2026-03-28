"use client";

import * as React from "react";
import Link from "next/link";

import { useMe } from "@/hooks/useMe";
import { Button } from "@/components/ui/button";
import { DrawerMenu, type DrawerMenuItem } from "@/components/ui/DrawerMenu";
import { TopbarFrame } from "@/components/shared/TopbarFrame";
import { BrandLockup } from "@/components/shared/BrandLockup";
import { cn } from "@/lib/utils";

import {
  CalendarDays,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  User,
  UserPlus,
  Users,
} from "lucide-react";

const publicNavLinks = [
  { name: "Home", href: "/", icon: User },
  { name: "Members", href: "/members", icon: Users },
  { name: "Events", href: "/events", icon: CalendarDays },
];

export function Navbar() {
  const { loading, isAuthed, isAdmin } = useMe();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = React.useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setMobileMenuOpen(false);
      window.location.href = "/";
    }
  }, []);

  const handleMobileDrawerLinkClick = React.useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const mobileItems = React.useMemo<DrawerMenuItem[]>(
    () =>
      publicNavLinks.map((link) => ({
        ...link,
        name: link.name,
      })),
    []
  );

  const brand = (
    <BrandLockup
      href="/"
      title={
        <span className="font-heading text-sm font-black uppercase tracking-[0.02em] text-foreground sm:text-base lg:text-lg">
          SVA -
          <span className="ml-1 italic text-[#e87500]">UT-Dallas</span>
        </span>
      }
    />
  );

  const desktopNav = (
    <nav className="flex items-center gap-1 rounded-full border border-border/50 bg-card/70 p-1 shadow-sm backdrop-blur-sm">
      {publicNavLinks.map((link) => {
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
          >
            <Icon className="h-4 w-4" />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );

  const sharedButtonClass = cn(
    "h-10 rounded-full px-5 text-sm font-semibold tracking-tight"
  );

  const desktopActions = (
    <>
      {!loading && !isAuthed && (
        <>
          <Button
            asChild
            size="sm"
            className={cn(
              sharedButtonClass,
              "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Link href="/login">Log In</Link>
          </Button>

          <Button
            asChild
            size="sm"
            className={cn(
              sharedButtonClass,
              "bg-accent text-accent-foreground hover:bg-accent/90"
            )}
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </>
      )}

      {!loading && isAuthed && (
        <>
          <Button
            asChild
            size="sm"
            className={cn(
              sharedButtonClass,
              "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Link href="/profile">My Profile</Link>
          </Button>

          {isAdmin && (
            <Button
              asChild
              size="sm"
              className={cn(
                sharedButtonClass,
                "bg-[#123a73] text-white hover:bg-[#10315f]"
              )}
            >
              <Link href="/admin">Admin</Link>
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            className={cn(
              sharedButtonClass,
              "bg-accent text-accent-foreground hover:bg-accent/90"
            )}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </>
      )}
    </>
  );

  const mobileTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-full border border-border/50 bg-card/70 backdrop-blur-sm hover:bg-secondary/70"
      onClick={() => setMobileMenuOpen(true)}
      aria-label="Open menu"
      title="Menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );

  return (
    <>
      <TopbarFrame
        compactBreakpointClassName="md"
        desktopBreakpointClassName="xl"
        leftMobile={brand}
        rightMobile={mobileTrigger}
        leftCompact={brand}
        rightCompact={mobileTrigger}
        leftDesktop={brand}
        centerDesktop={desktopNav}
        rightDesktop={desktopActions}
      />

      <DrawerMenu
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        title="Menu"
        srTitle="Mobile Navigation"
        items={mobileItems}
        itemsTitle=""
        bottomTitle=""
        bottomContent={
          !loading ? (
            !isAuthed ? (
              <>
                <Button
                  asChild
                  className={cn(
                    "w-full rounded-2xl px-4 py-3 font-semibold tracking-tight shadow-none",
                    "bg-primary text-primary-foreground hover:bg-primary/92"
                  )}
                >
                  <Link
                    href="/login"
                    onClick={handleMobileDrawerLinkClick}
                    className="flex w-full items-center justify-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Log In
                  </Link>
                </Button>

                <Button
                  asChild
                  className={cn(
                    "w-full rounded-2xl px-4 py-3 font-semibold tracking-tight shadow-none",
                    "bg-accent text-accent-foreground hover:bg-accent/90"
                  )}
                >
                  <Link
                    href="/signup"
                    onClick={handleMobileDrawerLinkClick}
                    className="flex w-full items-center justify-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  className={cn(
                    "w-full rounded-2xl px-4 py-3 font-semibold tracking-tight shadow-none",
                    "bg-primary text-primary-foreground hover:bg-primary/92"
                  )}
                >
                  <Link
                    href="/profile"
                    onClick={handleMobileDrawerLinkClick}
                    className="flex w-full items-center justify-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                </Button>

                {isAdmin && (
                  <Button
                    asChild
                    className={cn(
                      "w-full rounded-2xl px-4 py-3 font-semibold tracking-tight shadow-none",
                      "bg-[#123a73] text-white hover:bg-[#10315f]"
                    )}
                  >
                    <Link
                      href="/admin"
                      onClick={handleMobileDrawerLinkClick}
                      className="flex w-full items-center justify-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </Button>
                )}

                <Button
                  type="button"
                  className={cn(
                    "w-full rounded-2xl px-4 py-3 font-semibold tracking-tight shadow-none",
                    "bg-accent text-accent-foreground hover:bg-accent/90"
                  )}
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            )
          ) : null
        }
      />
    </>
  );
}