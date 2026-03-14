"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MajorAutocomplete } from "@/components/signup/MajorAutocomplete";
import {
  academicYearOptions,
  type AcademicYear,
  type SignUpFormValues,
  extractApiErrorMessage,
  normalizeSignUpValues,
  validateSignUpValues,
} from "@/components/signup/signup.helpers";
import { useGlobalStatusBanner } from "@/components/ui/GlobalStatusBannerProvider";
// import { ProfileImageSection } from "@/components/signup/ProfileImageSection";

const INPUT_CLASSNAME =
  "h-12 rounded-xl bg-secondary/20 border-border/40 focus:border-accent placeholder:text-xs text-sm md:text-base text-primary";

const INPUT_WITH_ICON_CLASSNAME = `pl-10 ${INPUT_CLASSNAME}`;
const INPUT_WITH_BOTH_ICONS_CLASSNAME = `pl-10 pr-12 ${INPUT_CLASSNAME}`;

const SELECT_BASE_CLASSNAME =
  "w-full h-12 rounded-xl bg-secondary/20 border border-border/40 px-3 focus:outline-none focus:border-accent";

const PASSWORD_ICON_BUTTON_CLASSNAME =
  "absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors";

const initialValues: SignUpFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  academicYear: "",
  major: "",
  password: "",
  confirmPassword: "",
};

type SignUpFormProps = {
  isPending?: boolean;
};

export function SignUpForm({ isPending = false }: SignUpFormProps) {
  const router = useRouter();
  const { showError, showSuccess, clear } = useGlobalStatusBanner();

  const [values, setValues] = React.useState<SignUpFormValues>(initialValues);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const setField = React.useCallback(
    <K extends keyof SignUpFormValues>(field: K, value: SignUpFormValues[K]) => {
      clear();
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    [clear]
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clear();

    const validationError = validateSignUpValues(values);
    if (validationError) {
      showError(validationError);
      return;
    }

    const normalized = normalizeSignUpValues(values);
    setSubmitting(true);

    try {
      const payload = {
        firstName: normalized.firstName,
        lastName: normalized.lastName,
        email: normalized.email,
        academicYear: normalized.academicYear,
        major: normalized.major,
        password: normalized.password,
      };

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg = extractApiErrorMessage(data, "Signup failed");
        showError(msg);
        return;
      }

      showSuccess("Account created!");

      window.setTimeout(() => {
        router.replace("/");
      }, 700);
    } catch (err: any) {
      console.error("Signup error:", err);
      const msg = err?.message || "An error occurred during signup";
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className="ui-eyebrow pl-1 text-muted-foreground"
          >
            First Name
          </Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="firstName"
              value={values.firstName}
              onChange={(e) => setField("firstName", e.target.value)}
              className={INPUT_WITH_ICON_CLASSNAME}
              placeholder="John"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="lastName"
            className="ui-eyebrow pl-1 text-muted-foreground"
          >
            Last Name
          </Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="lastName"
              value={values.lastName}
              onChange={(e) => setField("lastName", e.target.value)}
              className={INPUT_WITH_ICON_CLASSNAME}
              placeholder="Doe"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="ui-eyebrow pl-1 text-muted-foreground">
          UTD Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            className={INPUT_WITH_ICON_CLASSNAME}
            placeholder="netid@utdallas.edu"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="academicYear"
            className="ui-eyebrow pl-1 text-muted-foreground"
          >
            Academic Year
          </Label>
          <select
            id="academicYear"
            value={values.academicYear}
            onChange={(e) =>
              setField("academicYear", e.target.value as AcademicYear)
            }
            className={`${SELECT_BASE_CLASSNAME} ${
              values.academicYear === ""
                ? "text-xs text-muted-foreground"
                : "text-xs md:text-base text-primary"
            }`}
          >
            <option value="" disabled>
              Select...
            </option>

            {academicYearOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <MajorAutocomplete
          value={values.major}
          onChange={(next) => setField("major", next)}
          onClearError={() => clear()}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="ui-eyebrow pl-1 text-muted-foreground"
          >
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={(e) => setField("password", e.target.value)}
              className={INPUT_WITH_BOTH_ICONS_CLASSNAME}
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={PASSWORD_ICON_BUTTON_CLASSNAME}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="ui-eyebrow pl-1 text-muted-foreground"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={values.confirmPassword}
              onChange={(e) => setField("confirmPassword", e.target.value)}
              className={INPUT_WITH_BOTH_ICONS_CLASSNAME}
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className={PASSWORD_ICON_BUTTON_CLASSNAME}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="h-11 w-full rounded-full px-6 text-sm font-semibold tracking-[0.02em] shadow-none transition-all hover:-translate-y-0.5 hover:bg-accent md:h-12 md:px-7 md:text-base md:tracking-wide"
        disabled={submitting || isPending}
      >
        {submitting ? "Creating..." : "Create Account"}
      </Button>

      <div className="pt-2 text-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          <ChevronLeft size={16} />
          Back to Home
        </Link>
      </div>
    </form>
  );
}