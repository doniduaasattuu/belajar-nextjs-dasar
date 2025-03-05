import * as React from "react";

import GuestLayout from "@/components/layouts/GuestLayout";
import LoginForm from "@/components/login-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  if (status == "authenticated") {
    router.replace("/todolists");
  } else {
    return (
      <GuestLayout>
        <LoginForm />
      </GuestLayout>
    );
  }
}
