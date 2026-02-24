"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMe } from "@/hooks/useMe";
import * as Dialog from "@radix-ui/react-dialog";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  LayoutDashboard,
  Menu,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useRouter } from "next/navigation";

const baseNavLinks = [
  { name: "Home", href: "/", icon: User },
  { name: "Members", href: "/members", icon: Users },
  { name: "Events", href: "/events", icon: CalendarDays },
];

export function Navbar() {
  const router = useRouter();
  const { loading, isAuthed, isAdmin, refresh } = useMe();

  const navLinks = React.useMemo(() => {
    const links = [...baseNavLinks];

    if (isAuthed) {
      links.push({ name: "My Profile", href: "/profile", icon: User });
    }

    if (isAdmin) {
      links.push({
        name: "Admin Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      });
    }

    return links;
  }, [isAuthed, isAdmin]);

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest > previous && latest > 150) setHidden(true);
    else setHidden(false);

    setScrolled(latest > 50);
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setMobileMenuOpen(false);
      await refresh();
      router.replace("/");
      router.refresh();
    }
  };

  return (
    <motion.header
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-background/90 backdrop-blur-md border-b border-border/40 py-1",
        scrolled && "bg-background"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between gap-1">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-8 w-8 shrink-0">
            <Image
              src="/logo/logo.png"
              alt="SVA Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <span className="font-heading font-black text-sm sm:text-base md:text-xl tracking-tighter uppercase whitespace-nowrap">
            SVA <span className="text-accent italic">{/* UT-Dallas */}</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center bg-secondary/50 backdrop-blur-sm px-2 py-1.5 gap-5 rounded-full border border-border/40 font-bold">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="px-1 py-2 rounded-full text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all duration-300 relative group flex items-center gap-2"
              >
                <Icon className="h-5 w-5 mb-0.5 group-hover:text-accent transition-colors" />
                {link.name}
                <div className="absolute -bottom-1 left-1 right-1 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {!loading && (
            <>
              {/* Non-user */}
              {!isAuthed && (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className={cn(
                    "hidden md:inline-flex rounded-full",
                    "h-9 px-4",
                    "font-bold uppercase tracking-widest text-[11px]",
                    "transition-all"
                  )}
                >
                  <Link href="/login">
                    Log In
                  </Link>
                </Button>
              )}

              {/* Member/Admin: Logout */}
              {isAuthed && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={cn(
                    "hidden md:inline-flex rounded-full",
                    "h-9 px-4",
                    "font-black uppercase tracking-widest text-[11px]",
                    "transition-all"
                  )}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <AnimatePresence>
          {mobileMenuOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  aria-describedby=""
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 right-0 z-70 w-full max-w-sm bg-background p-6 flex flex-col shadow-2xl border-l border-border/40"
                >
                  <Dialog.Title className="sr-only">
                    Mobile Navigation
                  </Dialog.Title>

                  <div className="flex items-center justify-between mb-12">
                    <div className="font-heading font-black uppercase text-xl">
                      Menu
                    </div>
                    <Dialog.Close asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                      </Button>
                    </Dialog.Close>
                  </div>

                  <div className="flex flex-col gap-2">
                    {navLinks.map((link, i) => {
                      const Icon = link.icon;
                      return (
                        <motion.div
                          key={link.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-3xl font-black italic tracking-tighter uppercase flex items-center justify-between group"
                          >
                            <span className="flex items-center gap-2">
                              <Icon className="h-6 w-6 text-accent" />
                              {link.name}
                            </span>
                            <ArrowUpRight className="h-6 w-6 text-accent opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="flex-1" />

                  {/* Bottom CTA */}
                  {!loading && (
                    <div className="pt-6 border-t border-border/40 space-y-2">
                      {/* Non-user: Log In (primary) */}
                      {!isAuthed && (
                        <Button
                          asChild
                          size="lg"
                          className={cn("w-full rounded-full font-black uppercase tracking-widest")}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Link href="/login">
                            Log In
                          </Link>
                        </Button>
                      )}

                      {/* Member/Admin: Logout (primary) */}
                      {isAuthed && (
                        <Button
                          type="button"
                          size="lg"
                          className={cn("w-full rounded-full font-black uppercase tracking-widest")}
                          onClick={handleLogout}
                        >
                          Logout
                        </Button>
                      )}
                    </div>
                  )}

                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </motion.header>
  );
}