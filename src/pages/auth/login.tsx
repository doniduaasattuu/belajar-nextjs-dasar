import * as React from "react";
import { Suspense } from "react";

import GuestLayout from "@/components/layouts/GuestLayout";
import LoginForm from "@/components/login-form";
import Loading from "@/components/loader";

export default function LoginPage() {
  return (
    <GuestLayout>
      <Suspense fallback={<Loading />}>
        <LoginForm />
      </Suspense>
    </GuestLayout>
  );
}
