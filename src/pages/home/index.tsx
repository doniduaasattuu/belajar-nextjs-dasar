import * as React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import TodolistPage from "@/components/todolist";
const Dashboard = () => {
  return (
    <AuthenticatedLayout>
      <TodolistPage />
    </AuthenticatedLayout>
  );
};

export default Dashboard;
