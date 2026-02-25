"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Camera, Mail, User } from "lucide-react";

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

const academicYearOptions = [
  "UG Freshman",
  "UG Sophomore",
  "UG Junior",
  "UG Senior",
  "Graduate Student",
  "Alumni",
] as const;

type AcademicYear = (typeof academicYearOptions)[number];

export default function SignUpPage() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [academicYear, setAcademicYear] = React.useState<AcademicYear | "">("");
  const [major, setMajor] = React.useState("");

  const [imagePreview, setImagePreview] = React.useState<string>("");
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  // crop modal state
  const [cropOpen, setCropOpen] = React.useState(false);
  const [rawPreview, setRawPreview] = React.useState<string>("");

  // Limit preview suggestions to 6 at a time (datalist is browser-controlled; this caps supplied options)
  const majorSuggestions = React.useMemo(() => {
    const q = major.trim().toLowerCase();
    const list = q
      ? majors.filter((m) => m.toLowerCase().includes(q))
      : majors;
    return list.slice(0, 6);
  }, [major]);

  React.useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
      if (rawPreview?.startsWith("blob:")) URL.revokeObjectURL(rawPreview);
    };
  }, [imagePreview, rawPreview]);

  const onPickImage = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    fileInputRef.current?.click();
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // open crop modal with raw selection
    const url = URL.createObjectURL(file);

    setRawPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });

    setCropOpen(true);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onRemoveImage = () => {
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // FE stub: later this will POST to your backend.
    alert("Signup (FE stub): backend wiring will be added later.");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image (BPC style) */}
      <Image
        src="/auth/sva_auth.jpg"
        alt="SVA Authentication Background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Lighter overlay (less dark) */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Optional: Decorative glow elements over the photo (subtle) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-accent/10 blur-[110px]" />
      </div>

      {/* Page content */}
      <div className="relative z-10 min-h-screen px-6 pt-8 pb-24">
        {/* Crop dialog */}
        <ImageCropDialog
          open={cropOpen}
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
            // raw preview is no longer needed once we have cropped output
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

        {/* Centered card */}
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
                Already have an account?{" "}
                <br />
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
                {/* Profile picture (optional) */}
                <div className="space-y-3">
                  <div className="text-[12px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                    Profile Picture (Optional)
                  </div>

                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={onPickImage}
                      className="relative h-28 w-28 rounded-full border-2 border-dashed border-primary/40 overflow-hidden hover:bg-secondary/30 transition-colors group"
                      aria-label="Upload profile picture"
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
                    />

                    <div className="mt-4 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-2xl border-border/40"
                        onClick={onPickImage}
                      >
                        Select
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-2xl border-border/40"
                        onClick={onRemoveImage}
                        disabled={!selectedImage && !imagePreview}
                      >
                        Remove
                      </Button>
                    </div>
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

                    {/* Autocomplete via datalist; list is alphabetical */}
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

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Account
                </Button>

                {/* Back link moved below form, centered */}
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
          <p className="mt-10 text-center text-xs text-white/80 font-medium uppercase tracking-widest">
            All Rights Reserved. &copy;{" "}
            <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            SVA | UTDallas Chapter
          </p>
        </div>
      </div>
    </div>
  );
}