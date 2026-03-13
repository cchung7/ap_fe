// D:\ap_fe\src\components\signup\signup.helpers.ts
import { majors } from "@/data/majors";

export const academicYearOptions = [
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Graduate",
  "Alumni",
] as const;

export type AcademicYear = (typeof academicYearOptions)[number];

export type SignUpFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  academicYear: AcademicYear | "";
  major: string;
  password: string;
  confirmPassword: string;
};

export type NormalizedSignUpValues = {
  firstName: string;
  lastName: string;
  email: string;
  academicYear: string;
  major: string;
  password: string;
  confirmPassword: string;
};

export function extractApiErrorMessage(data: any, fallback: string) {
  const msg =
    typeof data?.message === "string" && data.message.trim() ? data.message : "";

  const sources = Array.isArray(data?.errorSources) ? data.errorSources : [];

  const lines =
    sources
      .map((s: any) => {
        if (!s) return "";
        if (typeof s === "string") return s;
        if (typeof s === "object") {
          const p = s.path ?? s.type ?? "";
          const m = s.message ?? s.details ?? "";
          const line = [p, m].filter(Boolean).join(": ");
          return line || "";
        }
        return "";
      })
      .filter(Boolean)
      .slice(0, 4) || [];

  if (msg) return msg;
  if (lines.length) return lines.join(" | ");
  return fallback;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidMajor(value: string) {
  const v = value.trim().toLowerCase();
  if (!v) return false;

  return majors.some((m) => m.trim().toLowerCase() === v);
}

export function getMajorSuggestions(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const starts = majors.filter((m) => m.toLowerCase().startsWith(q));
  const contains = majors.filter(
    (m) => !m.toLowerCase().startsWith(q) && m.toLowerCase().includes(q)
  );

  return [...starts, ...contains].slice(0, 10);
}

export function normalizeSignUpValues(
  values: SignUpFormValues
): NormalizedSignUpValues {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim().toLowerCase(),
    academicYear: String(values.academicYear || "").trim(),
    major: values.major.trim(),
    password: values.password,
    confirmPassword: values.confirmPassword,
  };
}

export function validateSignUpValues(values: SignUpFormValues) {
  const normalized = normalizeSignUpValues(values);

  if (!normalized.firstName) return "First name is required.";
  if (!normalized.lastName) return "Last name is required.";
  if (!normalized.email) return "Email is required.";
  if (!isValidEmail(normalized.email)) return "Please enter a valid email.";
  if (!normalized.academicYear) return "Academic year is required.";
  if (!normalized.major) return "Major is required.";
  if (!isValidMajor(normalized.major)) {
    return "Please select a major from the list.";
  }
  if (!normalized.password) return "Password is required.";
  if (!normalized.confirmPassword) return "Confirm password is required.";
  if (normalized.password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (normalized.password !== normalized.confirmPassword) {
    return "Passwords do not match.";
  }

  return null;
}