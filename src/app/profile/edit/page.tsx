"use client";

import * as React from "react";

import { EditProfileHeader } from "./_components/EditProfileHeader";
import { ProfileDetailsSection } from "./_components/ProfileDetailsSection";
import { ProfilePasswordSection } from "./_components/ProfilePasswordSection";
import { ProfileActionBar } from "./_components/ProfileActionBar";
import { useEditProfileForm } from "./_hooks/useEditProfileForm";

export default function EditProfilePage() {
  const {
    me,
    loading,
    values,
    submitting,
    pageLoading,
    isDirty,
    isBusy,
    setField,
    onReset,
    onSubmit,
    clearBanner,
    goBack,
  } = useEditProfileForm();

  if (loading || pageLoading || !me) return null;

  return (
    <div className="relative space-y-5 overflow-hidden pt-5 pb-16 sm:space-y-6 sm:pt-6 sm:pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[22rem] bg-navy-wash opacity-80" />

      <EditProfileHeader />

      <form onSubmit={onSubmit} noValidate className="space-y-6 sm:space-y-7">
        <ProfileDetailsSection
          values={values}
          isBusy={isBusy}
          isDirty={isDirty}
          onReset={onReset}
          onSetField={setField}
          onClearError={clearBanner}
        />

        <ProfilePasswordSection
          values={values}
          isBusy={isBusy}
          isDirty={isDirty}
          onReset={onReset}
          onSetField={setField}
        />

        <ProfileActionBar
          isBusy={isBusy}
          submitting={submitting}
          onBack={goBack}
        />
      </form>
    </div>
  );
}