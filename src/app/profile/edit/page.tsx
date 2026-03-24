/* eslint-disable @typescript-eslint/no-explicit-any */
// D:\ap_fe\src\app\profile\edit\page.tsx
"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMe } from "@/hooks/useMe";
import {
  Camera,
  Mail,
  Shield,
  User as UserIcon,
  CheckCircle2,
  Clock,
} from "lucide-react";

type ProfileStatus = "ACTIVE" | "PENDING" | "SUSPENDED";
type ProfileRole = "ADMIN" | "MEMBER";

export default function EditProfilePage() {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { me, loading } = useMe();

  const resolvedName = React.useMemo(() => (me?.name || "").toString(), [me]);
  const resolvedEmail = React.useMemo(
    () => (me?.email || "").toString(),
    [me]
  );
  const resolvedRole = React.useMemo(
    () => ((me?.role || "MEMBER") as ProfileRole),
    [me]
  );
  const resolvedStatus = React.useMemo(
    () => ((me?.status || "PENDING") as ProfileStatus),
    [me]
  );

  const [form, setForm] = React.useState({ name: "" });

  const [imagePreview, setImagePreview] = React.useState<string>("");
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (loading) return;
    if (me) return;
    router.replace("/login?next=/profile/edit");
  }, [loading, me, router]);

  React.useEffect(() => {
    if (!me) return;
    setForm({ name: resolvedName || "" });
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [me, resolvedName]);

  React.useEffect(() => {
    return () => {
      setImagePreview((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return prev;
      });
    };
  }, []);

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
      return "";
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onReset = () => {
    setForm({ name: resolvedName || "" });
    onRemoveImage();
  };

  const isDirty =
    form.name.trim() !== (resolvedName || "").trim() || Boolean(selectedImage);

  const removeDisabled = !selectedImage && imagePreview === "";

  if (loading || !me) return null;

  return (
    <div className="min-h-screen px-6 pb-12 pt-6">
      <div className="container mx-auto max-w-7xl space-y-10">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight text-primary md:text-6xl">
            Edit Profile
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Update your basic account information.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Badge
            variant="outline"
            className="rounded-full border border-border/40 bg-card/50 px-4 py-2 backdrop-blur-xl"
          >
            {resolvedRole === "ADMIN" ? (
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
            className="rounded-full border border-border/40 bg-card/50 px-4 py-2 backdrop-blur-xl"
          >
            {resolvedStatus === "ACTIVE" ? (
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={14} className="text-success" />
                Active
              </span>
            ) : resolvedStatus === "PENDING" ? (
              <span className="inline-flex items-center gap-2">
                <Clock size={14} className="text-warning" />
                Pending
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Clock size={14} className="text-warning" />
                Suspended
              </span>
            )}
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-[2.5rem] border border-border/40 bg-card/50 p-8 shadow-master backdrop-blur-xl">
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
                  className="group relative h-32 w-32 overflow-hidden rounded-full border-2 border-dashed border-border/60 transition-colors hover:bg-secondary/30"
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
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
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
                    <span className="font-semibold text-foreground">
                      {selectedImage.name}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-[2.5rem] border border-border/40 bg-card/50 p-8 shadow-master backdrop-blur-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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
                    Save Changes
                  </Button>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="pl-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Name
                  </div>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Your name"
                      className="h-12 rounded-xl border-border/40 bg-secondary/20 pl-10 focus:border-accent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="pl-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Email
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={resolvedEmail}
                      disabled
                      className="h-12 cursor-not-allowed rounded-xl border-border/40 bg-secondary/10 pl-10 opacity-90"
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