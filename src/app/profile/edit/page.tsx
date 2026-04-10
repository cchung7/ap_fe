"use client";

import * as React from "react";

import { ProfileDetailsSection } from "./_components/ProfileDetailsSection";
import { ProfilePasswordSection } from "./_components/ProfilePasswordSection";
import {
  ProfileEditPageFooter,
  ProfileEditPageHeader,
  ProfileOverviewSection,
} from "./_components/ProfileEditPageSections";
import { useEditProfileForm } from "./_hooks/useEditProfileForm";

export default function EditProfilePage() {
  const {
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
    onSubmit,
    clearBanner,
    goBack,
  } = useEditProfileForm();

  if (loading || pageLoading || !me) return null;

  return (
    <div className="relative space-y-5 overflow-hidden pt-5 pb-16 sm:space-y-6 sm:pt-6 sm:pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[22rem] bg-navy-wash opacity-80" />

      <form onSubmit={onSubmit} noValidate className="space-y-5 sm:space-y-6">
        <ProfileEditPageHeader
          role={resolvedRole}
          status={resolvedStatus}
          subRole={profile?.subRole ?? null}
        />

        <ProfileOverviewSection
          profile={profile}
          role={resolvedRole}
          status={resolvedStatus}
        />

        <ProfileDetailsSection
          values={values}
          isBusy={isBusy}
          onSetField={setField}
          onClearError={clearBanner}
        />

        <ProfilePasswordSection
          values={values}
          isBusy={isBusy}
          onSetField={setField}
        />

        <ProfileEditPageFooter
          isBusy={isBusy}
          isDirty={isDirty}
          submitting={submitting}
          onCancel={goBack}
        />
      </form>
    </div>
  );
}