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
  "Postgrad",
  "Alumni",
] as const;

type AcademicYear = (typeof academicYearOptions)[number];

export default function SignUpPage() {
  const PROFILE_PIC_ENABLED = false;

  const router = useRouter();
  const { loading, isAuthed, isAdmin, refresh } = useMe();

  React.useEffect(() => {
    if (loading) return;
    if (!isAuthed) return;

    router.replace(isAdmin ? "/admin" : "/");
    router.refresh();
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

  // crop modal state
  const [cropOpen, setCropOpen] = React.useState(false);
  const [rawPreview, setRawPreview] = React.useState<string>("");

  // Limit preview suggestions to 6 at a time
  const majorSuggestions = React.useMemo(() => {
    const q = major.trim().toLowerCase();
    const list = q ? majors.filter((m) => m.toLowerCase().includes(q)) : majors;
    return list.slice(0, 6);
  }, [major]);

  React.useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
      if (rawPreview?.startsWith("blob:")) URL.revokeObjectURL(rawPreview);
    };
  }, [imagePreview, rawPreview]);

  const onPickImage = () => {
    if (!PROFILE_PIC_ENABLED) return;
    if (fileInputRef.current) fileInputRef.current.value = "";
    fileInputRef.current?.click();
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!PROFILE_PIC_ENABLED) return;

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
    if (!PROFILE_PIC_ENABLED) return;

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          academicYear,
          major: major.trim(),
          password,
          // profileImageUrl intentionally omitted while feature is disabled
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error((data as any)?.message || "Signup failed");
      }

      await refresh(true);

      router.replace("/");
      router.refresh();
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "An error occurred during signup");
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

      <div className="relative z-10 min-h-screen px-6 pt-8 pb-24">
        {/* Keep dialog scaffold, but effectively disabled */}
        <ImageCropDialog
          open={PROFILE_PIC_ENABLED ? cropOpen : false}
          onOpenChange={PROFILE_PIC_ENABLED ? setCropOpen : () => {}}
          imageSrc={PROFILE_PIC_ENABLED ? rawPreview : ""}
          onCancel={() => {
            if (!PROFILE_PIC_ENABLED) return;
            setRawPreview((prev) => {
              if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
              return "";
            });
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          onCropped={({ file, previewUrl }) => {
            if (!PROFILE_PIC_ENABLED) return;

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

        <div className="flex flex-col items-center justify-start pt-6">
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

              <CardTitle className="text-3xl font-black uppercase italic tracking-tighter">
                Create An Account
              </CardTitle>

              <CardDescription className="text-muted-foreground font-medium uppercase tracking-widest text-xs">
                Already have an account? <br />
                <Link
                  href="/login"
                  className="underline underline-offset-4 hover:text-foreground transition-colors text-accent font-semibold"
                >
                  Sign in
                </Link>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={onSubmit} className="space-y-8">
                {/* Profile picture (optional) - DISABLED scaffold */}
                <div className="space-y-3">
                  <div className="text-[12px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                    Profile Picture (Optional)
                  </div>

                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={onPickImage}
                      disabled={!PROFILE_PIC_ENABLED}
                      className={[
                        "relative h-28 w-28 rounded-full border-2 border-dashed overflow-hidden transition-colors group",
                        PROFILE_PIC_ENABLED
                          ? "border-primary/40 hover:bg-secondary/30"
                          : "border-border/40 bg-secondary/10 opacity-60 cursor-not-allowed",
                      ].join(" ")}
                      aria-label="Upload profile picture"
                      title={
                        PROFILE_PIC_ENABLED
                          ? "Upload profile picture"
                          : "Profile pictures are temporarily disabled"
                      }
                    >
                      {imagePreview ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imagePreview}
                            alt="Profile preview"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="h-6 w-6" />
                          </span>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                          <Camera className="h-6 w-6" />
                          <span className="mt-2 text-[10px] font-black uppercase tracking-widest">
                            Upload
                          </span>
                        </div>
                      )}
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={onImageChange}
                      disabled={!PROFILE_PIC_ENABLED}
                    />

                    <div className="mt-4 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-2xl border-border/40"
                        onClick={onPickImage}
                        disabled={!PROFILE_PIC_ENABLED}
                        title={
                          PROFILE_PIC_ENABLED
                            ? "Select image"
                            : "Temporarily disabled"
                        }
                      >
                        Select
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-2xl border-border/40"
                        onClick={onRemoveImage}
                        disabled={!PROFILE_PIC_ENABLED || (!selectedImage && !imagePreview)}
                        title={
                          PROFILE_PIC_ENABLED
                            ? "Remove selection"
                            : "Temporarily disabled"
                        }
                      >
                        Remove
                      </Button>
                    </div>

                    {!PROFILE_PIC_ENABLED && (
                      <p className="mt-3 text-xs text-muted-foreground italic text-center">
                        Profile picture upload is temporarily disabled. You can
                        create your account now and add a photo later.
                      </p>
                    )}
                  </div>
                </div>

                {/* Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-[12px] font-black uppercase tracking-widest text-muted-foreground pl-1"
                    >
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-xs text-primary"
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-[12px] font-black uppercase tracking-widest text-muted-foreground pl-1"
                    >
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="pl-10 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-xs text-primary"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* UTD Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[12px] font-black uppercase tracking-widest text-muted-foreground pl-1"
                  >
                    UTD Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-xs text-primary"
                      placeholder="netid@utdallas.edu"
                      required
                    />
                  </div>
                </div>

                {/* Academic year + Major */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="academicYear"
                      className="text-[12px] font-black uppercase tracking-widest text-muted-foreground pl-1"
                    >
                      Academic Year
                    </Label>
                    <select
                      id="academicYear"
                      value={academicYear}
                      onChange={(e) =>
                        setAcademicYear(e.target.value as AcademicYear)
                      }
                      className={`w-full h-12 rounded-xl bg-secondary/20 border border-border/40 px-3 focus:outline-none focus:border-accent
                        ${
                          academicYear === ""
                            ? "text-xs text-muted-foreground"
                            : "text-xs text-primary"
                        }
                    `}
                      required
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
                      className="text-[12px] font-black uppercase tracking-widest text-muted-foreground pl-1"
                    >
                      Current Major
                    </Label>

                    <Input
                      id="major"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      className="h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-xs text-primary"
                      placeholder="Start typing..."
                      list="majors-list"
                      required
                    />
                    <datalist id="majors-list">
                      {majorSuggestions.map((m) => (
                        <option key={m} value={m} />
                      ))}
                    </datalist>

                    <p className="text-xs text-muted-foreground italic">
                      Non-case sensitive.
                    </p>
                  </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-[12px] font-black uppercase tracking-widest text-muted-foreground pl-1"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-12 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-xs text-primary"
                        placeholder="Create a password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-[12px] font-black uppercase tracking-widest text-muted-foreground pl-1"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-12 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-xs text-primary"
                        placeholder="Confirm password"
                        required
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
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={submitting}
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

          <p className="mt-4 text-center text-xs text-white/80 font-medium uppercase tracking-widest">
            All Rights Reserved. &copy;{" "}
            <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            SVA | UTDallas Chapter
          </p>
        </div>
      </div>
    </div>
  );
}