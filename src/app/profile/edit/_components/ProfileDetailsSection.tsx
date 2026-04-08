"use client";

import * as React from "react";
import { Mail, User as UserIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MajorAutocomplete } from "@/components/signup/MajorAutocomplete";
import { FieldShell } from "./FieldShell";
import {
  academicYearOptions,
  type EditProfileFormValues,
} from "@/components/profile/editProfile.helpers";

const INPUT_CLASSNAME =
  "h-13 rounded-[1.05rem] border border-[rgba(11,45,91,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(244,247,252,0.96)_100%)] text-[14px] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_24px_-18px_rgba(11,18,32,0.12)] placeholder:text-[12px] placeholder:text-muted-foreground/80 focus-visible:border-accent/45 focus-visible:ring-[3px] focus-visible:ring-[rgba(177,18,38,0.12)]";
const INPUT_WITH_ICON_CLASSNAME = `pl-11 ${INPUT_CLASSNAME}`;
const SELECT_BASE_CLASSNAME =
  "w-full h-13 rounded-[1.05rem] border border-[rgba(11,45,91,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(244,247,252,0.96)_100%)] px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_24px_-18px_rgba(11,18,32,0.12)] outline-none focus:border-accent/45 focus:ring-[3px] focus:ring-[rgba(177,18,38,0.12)]";

type ProfileDetailsSectionProps = {
  values: EditProfileFormValues;
  isBusy: boolean;
  isDirty: boolean;
  onReset: () => void;
  onSetField: <K extends keyof EditProfileFormValues>(
    field: K,
    value: EditProfileFormValues[K]
  ) => void;
  onClearError: () => void;
};

export function ProfileDetailsSection({
  values,
  isBusy,
  isDirty,
  onReset,
  onSetField,
  onClearError,
}: ProfileDetailsSectionProps) {
  return (
    <section className="rounded-[1.9rem] border border-border/60 bg-white/72 p-6 shadow-master backdrop-blur-md sm:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1.5">
          <p className="ui-eyebrow text-muted-foreground">Account Details</p>
          <h2 className="text-[1.55rem] font-black tracking-tight text-foreground sm:text-[1.7rem]">
            Edit Profile Information
          </h2>
          <p className="max-w-xl text-[13px] leading-6 text-muted-foreground">
            Manage your personal and academic profile details.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="rounded-2xl border border-red-700/10 bg-[linear-gradient(135deg,rgba(220,38,38,1)_0%,rgba(185,28,28,1)_100%)] px-4 text-white shadow-[0_14px_28px_-18px_rgba(185,28,28,0.45)] hover:bg-[linear-gradient(135deg,rgba(200,30,30,1)_0%,rgba(153,27,27,1)_100%)]"
            onClick={onReset}
            disabled={!isDirty || isBusy}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
        <FieldShell label="Name">
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={values.name}
              onChange={(e) => onSetField("name", e.target.value)}
              placeholder="Your full name"
              className={INPUT_WITH_ICON_CLASSNAME}
              disabled={isBusy}
            />
          </div>
        </FieldShell>

        <FieldShell label="Email">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              value={values.email}
              onChange={(e) => onSetField("email", e.target.value)}
              placeholder="netid@utdallas.edu"
              className={INPUT_WITH_ICON_CLASSNAME}
              disabled={isBusy}
            />
          </div>
        </FieldShell>

        <FieldShell label="Academic Year">
          <select
            value={values.academicYear}
            onChange={(e) => onSetField("academicYear", e.target.value)}
            disabled={isBusy}
            className={`${SELECT_BASE_CLASSNAME} ${
              values.academicYear === ""
                ? "text-[12px] text-muted-foreground"
                : "text-[14px] text-foreground"
            }`}
          >
            <option value="">Select...</option>
            {academicYearOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </FieldShell>

        <div className="md:col-span-2">
          <FieldShell label="Major">
            <MajorAutocomplete
              value={values.major}
              onChange={(next) => onSetField("major", next)}
              onClearError={onClearError}
            />
          </FieldShell>
        </div>
      </div>
    </section>
  );
}