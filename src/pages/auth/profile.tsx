import * as React from "react";
import { Suspense } from "react";

import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import Loading from "@/components/loader";

export default function ProfilePage() {
  return (
    <AuthenticatedLayout>
      <Suspense fallback={<Loading />}>Profile</Suspense>
    </AuthenticatedLayout>
  );
}
