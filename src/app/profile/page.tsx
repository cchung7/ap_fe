/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Mail,
  Shield,
  User as UserIcon,
  CheckCircle2,
  Clock,
} from "lucide-react";

type ProfileStatus = "ACTIVE" | "PENDING";
type ProfileRole = "ADMIN" | "MEMBER";

type ProfileModel = {
  name: string;
  email: string;
  role: ProfileRole;
  status: ProfileStatus;
  profileImage?: string; // future: persisted url
};

export default function ProfilePage() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Phase 1 placeholder "me"
  const [me] = React.useState<ProfileModel>({
    name: "Member Name",
    email: "member@sva-utdallas.org",
    role: "MEMBER",
    status: "ACTIVE",
    profileImage: "", // optional baseline
  });

  const [form, setForm] = React.useState({ name: me.name });

  const [imagePreview, setImagePreview] = React.useState<string>(
    me.profileImage || ""
  );
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  // Cleanup blob URLs on unmount
  React.useEffect(() => {
    return () => {
      setImagePreview((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return prev;
      });
    };
  }, []);

  // Reset when "me" changes (future: API fetch)
  React.useEffect(() => {
    setForm({ name: me.name });

    setImagePreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return me.profileImage || "";
    });

    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [me]);

  const onPickImage = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    fileInputRef.current?.click();
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    setImagePreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });

    setSelectedImage(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onRemoveImage = () => {
    setSelectedImage(null);

    setImagePreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return me.profileImage || "";
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onReset = () => {
    setForm({ name: me.name });
    onRemoveImage();
  };

  const isDirty =
    form.name.trim() !== me.name.trim() || Boolean(selectedImage);

  const removeDisabled =
    !selectedImage && imagePreview === (me.profileImage || "");

  return (
    <div className="min-h-screen bg-background pt-32 pb-12 px-6">
      <div className="container max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary">
            Edit Profile
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Update your basic account information.
          </p>
        </div>

        {/* Status Strip */}
        <div className="flex flex-wrap gap-3">
          <Badge
            variant="outline"
            className="border border-border/40 bg-card/50 backdrop-blur-xl rounded-full px-4 py-2"
          >
            {me.role === "ADMIN" ? (
              <span className="inline-flex items-center gap-2">
                <Shield size={14} className="text-accent" />
                Admin
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <UserIcon size={14} className="text-primary" />
                Member
              </span>
            )}
          </Badge>

          <Badge
            variant="outline"
            className="border border-border/40 bg-card/50 backdrop-blur-xl rounded-full px-4 py-2"
          >
            {me.status === "ACTIVE" ? (
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={14} className="text-success" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Clock size={14} className="text-warning" />
                Pending
              </span>
            )}
          </Badge>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Avatar card */}
          <div className="lg:col-span-1">
            <div className="rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-xl p-8 shadow-master">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Profile Photo
                </p>
                <p className="text-sm text-muted-foreground">
                  Local preview only (Phase 1)
                </p>
              </div>

              <div className="mt-7 flex flex-col items-center">
                <button
                  type="button"
                  onClick={onPickImage}
                  className="relative h-32 w-32 rounded-full border-2 border-dashed border-border/60 overflow-hidden hover:bg-secondary/30 transition-colors group"
                  aria-label="Change profile photo"
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
                        <Camera className="h-7 w-7" />
                      </span>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                      <Camera className="h-7 w-7" />
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

                <div className="mt-5 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-border/40"
                    onClick={onPickImage}
                  >
                    Choose
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-border/40"
                    onClick={onRemoveImage}
                    disabled={removeDisabled}
                    title="Removes local selection (Phase 1)"
                  >
                    Remove
                  </Button>
                </div>

                {selectedImage && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Selected:{" "}
                    <span className="text-foreground font-semibold">
                      {selectedImage.name}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Profile form */}
          <div className="lg:col-span-2">
            <div className="rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-xl p-8 shadow-master">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Account Details
                  </p>
                  <h2 className="text-2xl font-black tracking-tight text-foreground">
                    Edit Profile
                  </h2>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-border/40"
                    onClick={onReset}
                    disabled={!isDirty}
                  >
                    Reset
                  </Button>

                  <Button
                    type="button"
                    className="rounded-2xl bg-primary text-primary-foreground"
                    disabled
                    title="Persistence will be wired after backend/profile endpoints exist."
                  >
                    Save (Coming Soon)
                  </Button>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                    Name
                  </div>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Your name"
                      className="pl-10 h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent"
                    />
                  </div>
                </div>

                {/* Email (read-only for now) */}
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">
                    Email
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      value={me.email}
                      disabled
                      className="pl-10 h-12 rounded-xl bg-secondary/10 border-border/40 opacity-90 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isDirty && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-8 rounded-3xl border border-border/40 bg-secondary/20 p-5"
                  >
                    <p className="text-sm font-medium text-muted-foreground">
                      You have unsaved changes. Saving will be enabled once we
                      connect the profile endpoints.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Future seam: password change */}
            <div className="mt-8 rounded-[2.5rem] border-2 border-dashed border-border/40 bg-secondary/5 p-10 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Password change will be added later (after auth flow is
                finalized).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}