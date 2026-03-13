// D:\ap_fe\src\components\signup\ProfileImageSection.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageCropDialog } from "@/components/profile/ImageCropDialog";

type ProfileImageSectionProps = {
  disabled?: boolean;
};

export function ProfileImageSection({
  disabled = false,
}: ProfileImageSectionProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [cropOpen, setCropOpen] = React.useState(false);
  const [rawPreview, setRawPreview] = React.useState("");

  React.useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
      if (rawPreview?.startsWith("blob:")) URL.revokeObjectURL(rawPreview);
    };
  }, [imagePreview, rawPreview]);

  const onPickImage = () => {
    if (disabled) return;
    if (fileInputRef.current) fileInputRef.current.value = "";
    fileInputRef.current?.click();
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

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
    if (disabled) return;

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

  return (
    <>
      <ImageCropDialog
        open={disabled ? false : cropOpen}
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

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="ui-eyebrow pl-1 text-muted-foreground">
              Profile Picture
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Optional. Crop support is already isolated here for future S3/Spaces
              upload integration.
            </p>
          </div>

          {selectedImage && !disabled && (
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-border/40"
              onClick={onRemoveImage}
            >
              Remove
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border/40 bg-secondary/10 p-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border/40 bg-background/60">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profile preview"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Camera className="h-5 w-5" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-primary">
              {selectedImage ? selectedImage.name : "No image selected"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Recommended: square image for best crop results.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="rounded-2xl border-border/40"
            onClick={onPickImage}
            disabled={disabled}
          >
            {selectedImage ? "Change" : "Upload"}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onImageChange}
        />
      </div>
    </>
  );
}