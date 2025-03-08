import * as React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { Card } from "@/components/ui/card";
import UpdateUserForm from "@/components/update-user-form";
import UpdatePasswordForm from "@/components/update-password-form";

export default function ProfilePage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-8">
        <Card className="p-6">
          <div className="mb-6">
            <div className="font-semibold text-lg">Profile Information</div>
            <p className="text-sm text-muted-foreground">
              Update your account&apos;s profile information and username
            </p>
          </div>
          <UpdateUserForm />
        </Card>
        <Card className="p-6">
          <div className="mb-6">
            <div className="font-semibold text-lg">Profile</div>
            <p className="text-sm text-muted-foreground">
              Ensure your account is using a long, random password to stay
              secure
            </p>
          </div>
          <UpdatePasswordForm />
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
