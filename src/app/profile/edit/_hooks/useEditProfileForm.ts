"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useMe } from "@/hooks/useMe";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";
import {
  areProfileFormsEqual,
  buildEditProfilePayload,
  extractApiErrorMessage,
  getInitialEditProfileValues,
  mapProfileToForm,
  validateEditProfileValues,
  type EditProfileFormValues,
  type ProfileResponseDto,
} from "@/components/profile/editProfile.helpers";

type ProfileStatus = "ACTIVE" | "PENDING" | "SUSPENDED";
type ProfileRole = "ADMIN" | "MEMBER";

export function useEditProfileForm() {
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

  const resolvedRole = React.useMemo(
    () => ((profile?.role || me?.role || "MEMBER") as ProfileRole),
    [profile, me]
  );

  const resolvedStatus = React.useMemo(
    () => ((profile?.status || me?.status || "PENDING") as ProfileStatus),
    [profile, me]
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

      const nextProfile = data?.data?.profile ?? data?.profile ?? null;

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
  }, [fetchProfile, loading, me, router]);

  const setField = React.useCallback(
    <K extends keyof EditProfileFormValues>(
      field: K,
      value: EditProfileFormValues[K]
    ) => {
      clear();
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    [clear]
  );

  const onReset = React.useCallback(() => {
    clear();
    setValues(initialValues);
  }, [clear, initialValues]);

  const isDirty = !areProfileFormsEqual(values, initialValues);
  const isBusy = loading || pageLoading || submitting;

  const onSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
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

        const nextProfile = data?.data?.profile ?? data?.profile ?? null;

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
    },
    [clear, isDirty, refresh, showError, showSuccess, values]
  );

  return {
    me,
    loading,
    profile,
    values,
    submitting,
    pageLoading,
    isDirty,
    isBusy,
    resolvedRole,
    resolvedStatus,
    setField,
    onReset,
    onSubmit,
    clearBanner: clear,
    goBack: () => router.push("/profile"),
  };
}