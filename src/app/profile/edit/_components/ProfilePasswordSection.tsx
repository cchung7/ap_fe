"use client";

import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldShell } from "./FieldShell";
import { type EditProfileFormValues } from "@/components/profile/editProfile.helpers";

const INPUT_CLASSNAME =
  "h-13 rounded-[1.05rem] border border-[rgba(11,45,91,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(244,247,252,0.96)_100%)] text-[14px] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_10px_24px_-18px_rgba(11,18,32,0.12)] placeholder:text-[12px] placeholder:text-muted-foreground/80 focus-visible:border-accent/45 focus-visible:ring-[3px] focus-visible:ring-[rgba(177,18,38,0.12)]";
const INPUT_WITH_BOTH_ICONS_CLASSNAME = `pl-11 pr-12 ${INPUT_CLASSNAME}`;
const PASSWORD_ICON_BUTTON_CLASSNAME =
  "absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground";

type ProfilePasswordSectionProps = {
  values: EditProfileFormValues;
  isBusy: boolean;
  isDirty: boolean;
  onReset: () => void;
  onSetField: <K extends keyof EditProfileFormValues>(
    field: K,
    value: EditProfileFormValues[K]
  ) => void;
};

export function ProfilePasswordSection({
  values,
  isBusy,
  isDirty,
  onReset,
  onSetField,
}: ProfilePasswordSectionProps) {
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    React.useState(false);

  return (
    <section className="rounded-[1.9rem] border border-border/60 bg-white/72 p-6 shadow-master backdrop-blur-md sm:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1.5">
          <p className="ui-eyebrow text-muted-foreground">Security</p>
          <h2 className="text-[1.55rem] font-black tracking-tight text-foreground sm:text-[1.7rem]">
            Change Password
          </h2>
          <p className="max-w-xl text-[13px] leading-6 text-muted-foreground">
            Leave these fields blank if you do not want to change your password.
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

      <div className="mt-7 grid grid-cols-1 gap-5">
        <FieldShell label="Current Password">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={showCurrentPassword ? "text" : "password"}
              value={values.currentPassword}
              onChange={(e) => onSetField("currentPassword", e.target.value)}
              placeholder="Enter current password"
              className={INPUT_WITH_BOTH_ICONS_CLASSNAME}
              disabled={isBusy}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className={PASSWORD_ICON_BUTTON_CLASSNAME}
              aria-label={
                showCurrentPassword
                  ? "Hide current password"
                  : "Show current password"
              }
              disabled={isBusy}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </FieldShell>

        <FieldShell label="New Password">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={showNewPassword ? "text" : "password"}
              value={values.newPassword}
              onChange={(e) => onSetField("newPassword", e.target.value)}
              placeholder="Create a new password"
              className={INPUT_WITH_BOTH_ICONS_CLASSNAME}
              disabled={isBusy}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className={PASSWORD_ICON_BUTTON_CLASSNAME}
              aria-label={
                showNewPassword ? "Hide new password" : "Show new password"
              }
              disabled={isBusy}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </FieldShell>

        <FieldShell label="Confirm New Password">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={showConfirmNewPassword ? "text" : "password"}
              value={values.confirmNewPassword}
              onChange={(e) =>
                onSetField("confirmNewPassword", e.target.value)
              }
              placeholder="Confirm new password"
              className={INPUT_WITH_BOTH_ICONS_CLASSNAME}
              disabled={isBusy}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmNewPassword((prev) => !prev)}
              className={PASSWORD_ICON_BUTTON_CLASSNAME}
              aria-label={
                showConfirmNewPassword
                  ? "Hide confirm new password"
                  : "Show confirm new password"
              }
              disabled={isBusy}
            >
              {showConfirmNewPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </FieldShell>
      </div>
    </section>
  );
}