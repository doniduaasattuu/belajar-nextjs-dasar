import * as React from "react";
import { Suspense } from "react";

import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import Loading from "@/components/loader";

export default function ProfilePage() {
  return (
    <AuthenticatedLayout>
      <div className="h-full">Profile</div>
    </AuthenticatedLayout>
  );
}
