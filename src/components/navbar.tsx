"use client";

import { Button } from "@/components/ui/button";
import { DrawerMenu, type DrawerMenuItem } from "@/components/ui/DrawerMenu";
import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/useMe";
import {
  CalendarDays,
  LayoutDashboard,
  Menu,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { usePathname } from "next/navigation";

import { TopbarFrame } from "@/components/shared/TopbarFrame";
import { BrandLockup } from "@/components/shared/BrandLockup";

const baseNavLinks = [
  { name: "Home", href: "/", icon: User },
  { name: "Members", href: "/members", icon: Users },
  { name: "Events", href: "/events", icon: CalendarDays },
];

export function Navbar() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  const { loading, isAuthed, isAdmin } = useMe();

  const navLinks = React.useMemo(() => {
    const links = [...baseNavLinks];

    if (loading) return links;

    if (isAuthed) {
      links.push({ name: "My Profile", href: "/profile", icon: User });
    }

    return links;
  }, [loading, isAuthed]);

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
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
  };

  const handleMobileDrawerLinkClick = React.useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const mobileItems = React.useMemo<DrawerMenuItem[]>(
    () =>
      navLinks
        .filter((link) => link.href !== "/admin")
        .map((link) => ({
          ...link,
          name: link.name.toUpperCase(),
        })),
    [navLinks]
  );

  const brand = (
    <BrandLockup
      href="/"
      title={
        <span className="font-heading font-black text-base lg:text-lg tracking-tighter uppercase whitespace-nowrap">
          SVA -
          <span className="text-[#e87500] italic">UT-Dallas</span>
        </span>
      }
    />
  );

  const desktopNav = (
    <nav className="flex items-center bg-secondary/50 backdrop-blur-sm px-2 py-1.5 gap-5 rounded-full border border-border/40 font-bold">
      {navLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="px-1 py-2 rounded-full text-[11px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-all duration-300 relative group flex items-center gap-2 whitespace-nowrap"
          >
            <Icon className="h-5 w-5 mb-0.5 group-hover:text-accent transition-colors" />
            {link.name}
            <div className="absolute -bottom-1 left-1 right-1 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
          </Link>
        );
      })}
    </nav>
  );

  const sharedTopbarButtonClass = cn(
    "h-9 rounded-full px-4",
    "justify-center text-center",
    "font-semibold tracking-tight text-sm"
  );

  const desktopActions = (
    <>
      {!loading && (
        <>
          {!isAuthed && (
            <>
              <Button
                asChild
                size="sm"
                className={cn(
                  sharedTopbarButtonClass,
                  "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <Link href="/login" className="flex items-center justify-center">
                  Log In
                </Link>
              </Button>

              <Button
                asChild
                size="sm"
                className={cn(
                  sharedTopbarButtonClass,
                  "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
                )}
              >
                <Link href="/signup" className="flex items-center justify-center">
                  Sign Up
                </Link>
              </Button>
            </>
          )}

          {isAuthed && (
            <>
              {isAdmin && (
                <Button
                  asChild
                  size="sm"
                  className={cn(
                    sharedTopbarButtonClass,
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  <Link href="/admin" className="flex items-center justify-center">
                    Admin Dashboard
                  </Link>
                </Button>
              )}

              <Button
                type="button"
                size="sm"
                className={cn(
                  sharedTopbarButtonClass,
                  "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90"
                )}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </>
      )}
    </>
  );

  const compactActions = isAdminRoute ? (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={() => {
        window.dispatchEvent(new Event("admin-sidebar-toggle"));
      }}
    >
      <Menu className="h-6 w-6" />
    </Button>
  ) : (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={() => setMobileMenuOpen(true)}
    >
      <Menu className="h-6 w-6" />
    </Button>
  );

  return (
    <>
      <TopbarFrame
        compactBreakpointClassName="md"
        desktopBreakpointClassName="xl"
        leftMobile={brand}
        rightMobile={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => {
              if (isAdminRoute) {
                window.dispatchEvent(new Event("admin-sidebar-toggle"));
                return;
              }
              setMobileMenuOpen(true);
            }}
          >
            <Menu className="h-6 w-6" />
          </Button>
        }
        leftCompact={brand}
        rightCompact={compactActions}
        leftDesktop={brand}
        centerDesktop={desktopNav}
        rightDesktop={desktopActions}
      />

      {!isAdminRoute && (
        <DrawerMenu
          open={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
          title="MENU"
          srTitle="Mobile Navigation"
          items={mobileItems}
          bottomContent={
            !loading ? (
              !isAuthed ? (
                <>
                  <Button
                    asChild
                    className={cn(
                      "w-full rounded-2xl px-4 py-3",
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                      "justify-center text-center",
                      "font-semibold tracking-tight"
                    )}
                  >
                    <Link
                      href="/login"
                      onClick={handleMobileDrawerLinkClick}
                      className="flex w-full items-center justify-center"
                    >
                      Log In
                    </Link>
                  </Button>

                  <Button
                    asChild
                    className={cn(
                      "w-full rounded-2xl px-4 py-3",
                      "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90",
                      "justify-center text-center",
                      "font-semibold tracking-tight"
                    )}
                  >
                    <Link
                      href="/signup"
                      onClick={handleMobileDrawerLinkClick}
                      className="flex w-full items-center justify-center"
                    >
                      Sign Up
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <Button
                      asChild
                      className={cn(
                        "w-full rounded-2xl px-4 py-3",
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                        "justify-center text-center",
                        "font-semibold tracking-tight"
                      )}
                    >
                      <Link
                        href="/admin"
                        onClick={handleMobileDrawerLinkClick}
                        className="flex w-full items-center justify-center"
                      >
                        Admin Dashboard
                      </Link>
                    </Button>
                  )}

                  <Button
                    type="button"
                    className={cn(
                      "w-full rounded-2xl px-4 py-3",
                      "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90",
                      "justify-center text-center",
                      "font-semibold tracking-tight"
                    )}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              )
            ) : null
          }
        />
      )}
    </>
  );
}