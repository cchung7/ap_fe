import {
  academicYearOptions,
  extractApiErrorMessage,
  isValidEmail,
} from "@/components/signup/signup.helpers";
import { majors } from "@/data/majors";

export { academicYearOptions, extractApiErrorMessage };

export type EditProfileFormValues = {
  name: string;
  email: string;
  academicYear: string;
  major: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type ProfileResponseDto = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER" | string;
  subRole?: string | null;
  status?: "ACTIVE" | "PENDING" | "SUSPENDED" | string;
  academicYear?: string | null;
  major?: string | null;
  pointsTotal?: number;
  createdAt?: string;
  updatedAt?: string;
};

export function getInitialEditProfileValues(): EditProfileFormValues {
  return {
    name: "",
    email: "",
    academicYear: "",
    major: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
}

export function mapProfileToForm(profile: ProfileResponseDto): EditProfileFormValues {
  return {
    name: String(profile?.name || ""),
    email: String(profile?.email || ""),
    academicYear: String(profile?.academicYear || ""),
    major: String(profile?.major || ""),
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
}

export function normalizeEditProfileValues(values: EditProfileFormValues) {
  return {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    academicYear: values.academicYear.trim(),
    major: values.major.trim(),
    currentPassword: values.currentPassword,
    newPassword: values.newPassword,
    confirmNewPassword: values.confirmNewPassword,
  };
}

function isValidMajor(value: string) {
  const v = value.trim().toLowerCase();
  if (!v) return true;

  return majors.some((m) => m.trim().toLowerCase() === v);
}

export function validateEditProfileValues(values: EditProfileFormValues) {
  const normalized = normalizeEditProfileValues(values);

  if (!normalized.name) return "Name is required.";
  if (!normalized.email) return "Email is required.";
  if (!isValidEmail(normalized.email)) {
    return "Please enter a valid email.";
  }

  if (
    normalized.academicYear &&
    !academicYearOptions.includes(normalized.academicYear as any)
  ) {
    return "Please select a valid academic year.";
  }

  if (!isValidMajor(normalized.major)) {
    return "Please select a major from the list.";
  }

  const wantsPasswordChange = Boolean(
    normalized.currentPassword ||
      normalized.newPassword ||
      normalized.confirmNewPassword
  );

  if (wantsPasswordChange) {
    if (!normalized.currentPassword) {
      return "Current password is required to change your password.";
    }
    if (!normalized.newPassword) {
      return "New password is required.";
    }
    if (!normalized.confirmNewPassword) {
      return "Please confirm your new password.";
    }
    if (normalized.newPassword.length < 8) {
      return "New password must be at least 8 characters.";
    }
    if (normalized.newPassword === normalized.currentPassword) {
      return "New password must be different from your current password.";
    }
    if (normalized.newPassword !== normalized.confirmNewPassword) {
      return "Passwords do not match.";
    }
  }

  return null;
}

export function buildEditProfilePayload(values: EditProfileFormValues) {
  const normalized = normalizeEditProfileValues(values);

  return {
    name: normalized.name,
    email: normalized.email,
    academicYear: normalized.academicYear,
    major: normalized.major,
    currentPassword: normalized.currentPassword || undefined,
    newPassword: normalized.newPassword || undefined,
    confirmNewPassword: normalized.confirmNewPassword || undefined,
  };
}

export function areProfileFormsEqual(
  a: EditProfileFormValues,
  b: EditProfileFormValues
) {
  const left = normalizeEditProfileValues(a);
  const right = normalizeEditProfileValues(b);

  return (
    left.name === right.name &&
    left.email === right.email &&
    left.academicYear === right.academicYear &&
    left.major === right.major &&
    left.currentPassword === right.currentPassword &&
    left.newPassword === right.newPassword &&
    left.confirmNewPassword === right.confirmNewPassword
  );
}