// D:\ap_fe\src\app\signup\page.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Camera,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { majors } from "@/data/majors";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageCropDialog } from "@/components/profile/ImageCropDialog";
import { useMe } from "@/hooks/useMe";

const academicYearOptions = [
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Graduate",
  "Alumni",
] as const;

type AcademicYear = (typeof academicYearOptions)[number];

function extractApiErrorMessage(data: any, fallback: string) {
  const msg =
    typeof data?.message === "string" && data.message.trim() ? data.message : "";

  const sources = Array.isArray(data?.errorSources) ? data.errorSources : [];

  const lines =
    sources
      .map((s: any) => {
        if (!s) return "";
        if (typeof s === "string") return s;
        if (typeof s === "object") {
          const p = s.path ?? s.type ?? "";
          const m = s.message ?? s.details ?? "";
          const line = [p, m].filter(Boolean).join(": ");
          return line || "";
        }
        return "";
      })
      .filter(Boolean)
      .slice(0, 4) || [];

  if (msg) return msg;
  if (lines.length) return lines.join(" | ");
  return fallback;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidMajor(value: string) {
  const v = value.trim().toLowerCase();
  if (!v) return false;
  return majors.some((m) => m.trim().toLowerCase() === v);
}

export default function SignUpPage() {
  const router = useRouter();
  const { loading, isAuthed, isAdmin } = useMe();

  const PROFILE_PIC_DISABLED = true;

  const didSubmitNavigateRef = React.useRef(false);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (didSubmitNavigateRef.current) return;
    if (loading) return;
    if (!isAuthed) return;

    startTransition(() => {
      router.replace(isAdmin ? "/admin" : "/");
    });
  }, [loading, isAuthed, isAdmin, router]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [academicYear, setAcademicYear] = React.useState<AcademicYear | "">("");
  const [major, setMajor] = React.useState("");

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const [imagePreview, setImagePreview] = React.useState<string>("");
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  const [cropOpen, setCropOpen] = React.useState(false);
  const [rawPreview, setRawPreview] = React.useState<string>("");

  const [majorOpen, setMajorOpen] = React.useState(false);

  const clearError = React.useCallback(() => {
    if (error) setError("");
  }, [error]);

  const majorSuggestions = React.useMemo(() => {
    const q = major.trim().toLowerCase();
    if (!q) return [];

    const starts = majors.filter((m) => m.toLowerCase().startsWith(q));
    const contains = majors.filter(
      (m) => !m.toLowerCase().startsWith(q) && m.toLowerCase().includes(q)
    );

    return [...starts, ...contains].slice(0, 10);
  }, [major]);

  React.useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
      if (rawPreview?.startsWith("blob:")) URL.revokeObjectURL(rawPreview);
    };
  }, [imagePreview, rawPreview]);

  const onPickImage = () => {
    if (PROFILE_PIC_DISABLED) return;
    if (fileInputRef.current) fileInputRef.current.value = "";
    fileInputRef.current?.click();
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (PROFILE_PIC_DISABLED) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    setRawPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });

    setCropOpen(true);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onRemoveImage = () => {
    if (PROFILE_PIC_DISABLED) return;

    setSelectedImage(null);

    setImagePreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return "";
    });

    setRawPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return "";
    });

    setCropOpen(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const showBannerError = (msg: string) => {
    setError(msg);
    toast.error(msg);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim().toLowerCase();
    const ay = (academicYear || "").toString().trim();
    const mj = major.trim();

    if (!fn) return showBannerError("First name is required.");
    if (!ln) return showBannerError("Last name is required.");
    if (!em) return showBannerError("Email is required.");
    if (!isValidEmail(em)) return showBannerError("Please enter a valid email.");
    if (!ay) return showBannerError("Academic year is required.");
    if (!mj) return showBannerError("Major is required.");

    if (!isValidMajor(mj)) {
      return showBannerError("Please select a major from the list.");
    }

    if (!password) return showBannerError("Password is required.");
    if (!confirmPassword) return showBannerError("Confirm password is required.");

    if (password.length < 8) {
      return showBannerError("Password must be at least 8 characters.");
    }

    if (password !== confirmPassword) {
      return showBannerError("Passwords do not match.");
    }

    setSubmitting(true);

    try {
      const payload: any = {
        firstName: fn,
        lastName: ln,
        email: em,
        academicYear: ay,
        major: mj,
        password,
      };

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg = extractApiErrorMessage(data, "Signup failed");
        showBannerError(msg);
        return;
      }

      toast.success("Account created!", {
        description: "Thank you for registering",
      });

      didSubmitNavigateRef.current = true;
      startTransition(() => {
        router.replace("/");
      });
    } catch (err: any) {
      console.error("Signup error:", err);
      const msg = err?.message || "An error occurred during signup";
      showBannerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/auth/sva_auth.jpg"
        alt="SVA Authentication Background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/10" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-accent/10 blur-[110px]" />
      </div>

      <div className="relative z-10 min-h-screen px-6 pt-2 pb-24 md:pt-24">
        <ImageCropDialog
          open={PROFILE_PIC_DISABLED ? false : cropOpen}
          onOpenChange={setCropOpen}
          imageSrc={rawPreview}
          onCancel={() => {
            setRawPreview((prev) => {
              if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
              return "";
            });
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          onCropped={({ file, previewUrl }) => {
            setRawPreview((prev) => {
              if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
              return "";
            });

            setImagePreview((prev) => {
              if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
              return previewUrl;
            });

            setSelectedImage(file);

            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        />

        <div className="flex flex-col items-center justify-start pt-8 md:pt-12">
          <Card className="w-full max-w-2xl border-2 border-border/40 bg-card/90 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-4 text-center pb-8 pt-6">
              <div className="flex justify-center mb-2">
                <div className="relative h-20 w-20">
                  <Image
                    src="/logo/logo.png"
                    alt="SVA Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <CardTitle className="ui-title text-[2rem] md:text-[2.3rem] uppercase italic">
                Create An Account
              </CardTitle>

              <CardDescription className="ui-body max-w-sm mx-auto text-sm md:text-base font-medium text-muted-foreground">
                <>
                  <span className="inline-block text-[11px] md:text-xs font-black uppercase tracking-widest text-muted-foreground/80">
                    Already have an account?
                  </span>
                  <br />
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-accent underline underline-offset-4 hover:text-foreground transition-colors"
                  >
                    Sign in
                  </Link>
                </>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={onSubmit} noValidate className="space-y-8">
                {/* Profile picture (optional) */}
                {/* ...kept as-is... */}

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="ui-eyebrow pl-1 text-muted-foreground"
                    >
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => {
                          clearError();
                          setFirstName(e.target.value);
                        }}
                        className="pl-10 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-sm md:text-base text-primary"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="ui-eyebrow pl-1 text-muted-foreground"
                    >
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => {
                          clearError();
                          setLastName(e.target.value);
                        }}
                        className="pl-10 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-sm md:text-base text-primary"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="ui-eyebrow pl-1 text-muted-foreground"
                  >
                    UTD Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        clearError();
                        setEmail(e.target.value);
                      }}
                      className="pl-10 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-sm md:text-base text-primary"
                      placeholder="netid@utdallas.edu"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="academicYear"
                      className="ui-eyebrow pl-1 text-muted-foreground"
                    >
                      Academic Year
                    </Label>
                    <select
                      id="academicYear"
                      value={academicYear}
                      onChange={(e) => {
                        clearError();
                        setAcademicYear(e.target.value as AcademicYear);
                      }}
                      className={`w-full h-12 rounded-xl bg-secondary/20 border border-border/40 px-3 focus:outline-none focus:border-accent ${
                        academicYear === ""
                          ? "text-xs text-muted-foreground"
                          : "text-xs md:text-base text-primary"
                      }`}
                    >
                      <option value="" disabled>
                        Select...
                      </option>
                      {academicYearOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="major"
                      className="ui-eyebrow pl-1 text-muted-foreground"
                    >
                      Current Major
                    </Label>

                    <div className="relative">
                      <Input
                        id="major"
                        value={major}
                        onChange={(e) => {
                          clearError();
                          setMajor(e.target.value);
                          setMajorOpen(true);
                        }}
                        onFocus={() => {
                          if (major.trim()) setMajorOpen(true);
                        }}
                        onBlur={() => {
                          window.setTimeout(() => setMajorOpen(false), 120);
                        }}
                        className="h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-sm md:text-base text-primary"
                        placeholder="Start typing..."
                      />

                      {majorOpen && majorSuggestions.length > 0 && (
                        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border/40 bg-card/95 backdrop-blur-md shadow-xl overflow-hidden">
                          <ul className="max-h-56 overflow-auto py-1">
                            {majorSuggestions.map((m) => (
                              <li key={m}>
                                <button
                                  type="button"
                                  className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-secondary/40 transition-colors"
                                  onMouseDown={(ev) => ev.preventDefault()}
                                  onClick={() => {
                                    clearError();
                                    setMajor(m);
                                    setMajorOpen(false);
                                  }}
                                >
                                  {m}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="ui-eyebrow pl-1 text-muted-foreground"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          clearError();
                          setPassword(e.target.value);
                        }}
                        className="pl-10 pr-12 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-sm md:text-base text-primary"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="ui-eyebrow pl-1 text-muted-foreground"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          clearError();
                          setConfirmPassword(e.target.value);
                        }}
                        className="pl-10 pr-12 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-sm md:text-base text-primary"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium text-center">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 md:h-12 rounded-full px-6 md:px-7 text-sm md:text-base font-semibold tracking-[0.02em] md:tracking-wide shadow-none transition-all hover:-translate-y-0.5 hover:bg-accent"
                  disabled={submitting || isPending}
                >
                  {submitting ? "Creating..." : "Create Account"}
                </Button>

                <div className="pt-2 text-center">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
                  >
                    <ChevronLeft size={16} />
                    Back to Home
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="mt-4 text-center text-xs text-white/80 font-semibold uppercase tracking-widest">
            All Rights Reserved. &copy;{""}
            <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            SVA | UT-Dallas
          </p>
        </div>
      </div>
    </div>
  );
}