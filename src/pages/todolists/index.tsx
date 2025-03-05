import * as React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import TodolistPage from "@/components/todolist";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { status } = useSession();

  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [router, status]);

  if (status !== "loading") {
    return (
      <AuthenticatedLayout>
        <TodolistPage />
      </AuthenticatedLayout>
    );
  }
};

export default Dashboard;
