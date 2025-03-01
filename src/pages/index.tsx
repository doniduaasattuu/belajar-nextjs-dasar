import Link from "next/link";
import * as React from "react";

const Dashboard = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen ">
      <h1 className="font-bold text-4xl text-muted-foreground">
        <Link href="/auth/login">Login</Link>
      </h1>
    </div>
  );
};

export default Dashboard;
