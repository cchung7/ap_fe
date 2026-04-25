import { Suspense } from "react";
import OtpClient from "./OtpClient";

export default function PasswordResetOtpPage() {
  return (
    <Suspense fallback={null}>
      <OtpClient />
    </Suspense>
  );
}