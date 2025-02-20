import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import { LoadingButton } from "@/components/loading-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/router";
import * as React from "react";

const Dashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleLogout = async () => {
    setIsLoading(true);
    const response = await fetch("/api/auth/logout", { method: "DELETE" });

    if (response.ok) {
      router.push("/auth/login");
    }
    setIsLoading(false);
  };

  return (
    <AuthenticatedLayout>
      <div>Dashboard</div>
      <LoadingButton onClick={handleLogout} loading={isLoading}>
        Logout
      </LoadingButton>

      <ThemeToggle />
    </AuthenticatedLayout>
  );
};

export default Dashboard;
