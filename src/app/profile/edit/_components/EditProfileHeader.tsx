"use client";

import * as React from "react";

export function EditProfileHeader() {
  return (
    <section className="rounded-[1.6rem] border border-border/60 bg-white/65 px-5 py-5 shadow-[0_18px_42px_-24px_rgba(11,18,32,0.16)] backdrop-blur-md sm:px-6 sm:py-6">
      <div className="space-y-1.5">
        <p className="ui-eyebrow text-muted-foreground">Profile Settings</p>

        <h1 className="text-[2.25rem] font-black tracking-tight text-primary sm:text-[2.7rem] lg:text-[3rem]">
          Edit My Profile
        </h1>

        <p className="max-w-2xl text-[14px] leading-7 text-muted-foreground sm:text-[15px]">
          Update your account details and security settings from one place.
        </p>
      </div>
    </section>
  );
}