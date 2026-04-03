/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Lock,
  Mail,
  Shield,
  User as UserIcon,
  Eye,
  EyeOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { MajorAutocomplete } from "@/components/signup/MajorAutocomplete";
import { useMe } from "@/hooks/useMe";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";
import {
  academicYearOptions,
  areProfileFormsEqual,
  buildEditProfilePayload,
  extractApiErrorMessage,
  getInitialEditProfileValues,
  mapProfileToForm,
  type EditProfileFormValues,
  type ProfileResponseDto,
  validateEditProfileValues,
} from "@/components/profile/editProfile.helpers";

type ProfileStatus = "ACTIVE" | "PENDING" | "SUSPENDED";
type ProfileRole = "ADMIN" | "MEMBER";

const INPUT_CLASSNAME =
  "h-12 rounded-xl border-border/40 bg-secondary/20 text-sm md:text-base text-primary placeholder:text-xs focus:border-accent";
const INPUT_WITH_ICON_CLASSNAME = `pl-10 ${INPUT_CLASSNAME}`;
const INPUT_WITH_BOTH_ICONS_CLASSNAME = `pl-10 pr-12 ${INPUT_CLASSNAME}`;
const SELECT_BASE_CLASSNAME =
  "w-full h-12 rounded-xl border border-border/40 bg-secondary/20 px-3 focus:outline-none focus:border-accent";
const PASSWORD_ICON_BUTTON_CLASSNAME =
  "absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground";

function FieldShell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="ui-eyebrow pl-1 text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export default function EditProfilePage() {
  const router = useRouter();
  const { me, loading, refresh } = useMe();
  const { showError, showSuccess, clear } = useGlobalStatusBanner();

  const [profile, setProfile] = React.useState<ProfileResponseDto | null>(null);
  const [initialValues, setInitialValues] = React.useState<EditProfileFormValues>(
    getInitialEditProfileValues()
  );
  const [values, setValues] = React.useState<EditProfileFormValues>(
    getInitialEditProfileValues()
  );

  const [pageLoading, setPageLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    React.useState(false);

  const resolvedRole = React.useMemo(
    () => ((profile?.role || me?.role || "MEMBER") as ProfileRole),
    [profile, me]
  );

  const resolvedStatus = React.useMemo(
    () => ((profile?.status || me?.status || "PENDING") as ProfileStatus),
    [profile, me]
  );

  const setField = React.useCallback(
    <K extends keyof EditProfileFormValues>(field: K, value: EditProfileFormValues[K]) => {
      clear();
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    [clear]
  );

  const fetchProfile = React.useCallback(async () => {
    setPageLoading(true);

    try {
      const response = await fetch("/api/profile/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        router.replace("/login?next=/profile/edit");
        return;
      }

      if (!response.ok) {
        const msg = extractApiErrorMessage(data, "Failed to load profile.");
        showError(msg);
        return;
      }

      const nextProfile =
        data?.data?.profile ??
        data?.profile ??
        null;

      if (!nextProfile) {
        showError("Profile data was not returned.");
        return;
      }

      const mapped = mapProfileToForm(nextProfile);
      setProfile(nextProfile);
      setInitialValues(mapped);
      setValues(mapped);
    } catch (err: any) {
      showError(err?.message || "Failed to load profile.");
    } finally {
      setPageLoading(false);
    }
  }, [router, showError]);

  React.useEffect(() => {
    if (loading) return;
    if (!me) {
      router.replace("/login?next=/profile/edit");
      return;
    }
    void fetchProfile();
  }, [loading, me, router, fetchProfile]);

  const isDirty = !areProfileFormsEqual(values, initialValues);
  const isBusy = loading || pageLoading || submitting;

  const onReset = React.useCallback(() => {
    clear();
    setValues(initialValues);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
  }, [clear, initialValues]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clear();

    const validationError = validateEditProfileValues(values);
    if (validationError) {
      showError(validationError);
      return;
    }

    if (!isDirty) {
      showError("There are no changes to save.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = buildEditProfilePayload(values);

      const response = await fetch("/api/profile/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg = extractApiErrorMessage(data, "Failed to update profile.");
        showError(msg);
        return;
      }

      const nextProfile =
        data?.data?.profile ??
        data?.profile ??
        null;

      if (nextProfile) {
        const mapped = mapProfileToForm(nextProfile);
        setProfile(nextProfile);
        setInitialValues(mapped);
        setValues(mapped);
      } else {
        const normalized = {
          ...values,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        };
        setInitialValues(normalized);
        setValues(normalized);
      }

      await refresh({ silent: true });

      showSuccess(
        payload.newPassword
          ? "Your profile and password were updated."
          : "Your profile was updated."
      );
    } catch (err: any) {
      showError(err?.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || pageLoading || !me) return null;

  return (
    <div className="min-h-screen px-6 pb-12 pt-6">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight text-primary md:text-6xl">
            Edit My Profile
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Update your account details and security settings.
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

        <form onSubmit={onSubmit} noValidate className="space-y-8">
          <div className="rounded-[2.5rem] border border-border/40 bg-card/50 p-8 shadow-master backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Account Details
                </p>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  Edit Profile Information
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl border-border/40"
                  onClick={onReset}
                  disabled={!isDirty || isBusy}
                >
                  Reset
                </Button>

                <Button
                  type="submit"
                  className="rounded-2xl bg-primary text-primary-foreground"
                  disabled={isBusy}
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <FieldShell label="Name">
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={values.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="Your full name"
                    className={INPUT_WITH_ICON_CLASSNAME}
                  />
                </div>
              </FieldShell>

              <FieldShell label="Email">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    value={values.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="netid@utdallas.edu"
                    className={INPUT_WITH_ICON_CLASSNAME}
                  />
                </div>
              </FieldShell>

              <FieldShell label="Academic Year">
                <select
                  value={values.academicYear}
                  onChange={(e) => setField("academicYear", e.target.value)}
                  className={`${SELECT_BASE_CLASSNAME} ${
                    values.academicYear === ""
                      ? "text-xs text-muted-foreground"
                      : "text-xs md:text-base text-primary"
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
                    onChange={(next) => setField("major", next)}
                    onClearError={() => clear()}
                  />
                </FieldShell>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-border/40 bg-card/50 p-8 shadow-master backdrop-blur-xl">
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Security
              </p>
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                Change Password
              </h2>
              <p className="text-sm text-muted-foreground">
                Leave these fields blank if you do not want to change your password.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <FieldShell label="Current Password">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={values.currentPassword}
                    onChange={(e) => setField("currentPassword", e.target.value)}
                    placeholder="Enter current password"
                    className={INPUT_WITH_BOTH_ICONS_CLASSNAME}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className={PASSWORD_ICON_BUTTON_CLASSNAME}
                    aria-label={
                      showCurrentPassword ? "Hide current password" : "Show current password"
                    }
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
                    onChange={(e) => setField("newPassword", e.target.value)}
                    placeholder="Create a new password"
                    className={INPUT_WITH_BOTH_ICONS_CLASSNAME}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className={PASSWORD_ICON_BUTTON_CLASSNAME}
                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FieldShell>

              <div className="md:col-span-2">
                <FieldShell label="Confirm New Password">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={showConfirmNewPassword ? "text" : "password"}
                      value={values.confirmNewPassword}
                      onChange={(e) =>
                        setField("confirmNewPassword", e.target.value)
                      }
                      placeholder="Confirm new password"
                      className={INPUT_WITH_BOTH_ICONS_CLASSNAME}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmNewPassword((prev) => !prev)
                      }
                      className={PASSWORD_ICON_BUTTON_CLASSNAME}
                      aria-label={
                        showConfirmNewPassword
                          ? "Hide confirm new password"
                          : "Show confirm new password"
                      }
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
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-border/40"
              onClick={() => router.push("/profile")}
              disabled={isBusy}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="rounded-2xl bg-primary text-primary-foreground"
              disabled={isBusy}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}