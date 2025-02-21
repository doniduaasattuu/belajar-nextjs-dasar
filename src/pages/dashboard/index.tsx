import * as React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";

const Dashboard = () => {
  return (
    <AuthenticatedLayout>
      <div className="flex justify-center items-center w-full h-screen">
        <h1 className="font-bold text-4xl">Hello World!</h1>
      </div>
    </AuthenticatedLayout>
  );
};

export default Dashboard;
