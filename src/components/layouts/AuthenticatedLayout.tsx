import React from "react";
import Navbar from "../navbar";
import { Toaster } from "@/components/ui/sonner";
import { Card } from "../ui/card";

export default function AuthenticatedLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <Card className="h-screen w-full rounded-none shadow-none border-none">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">{children}</div>
      <Toaster className="bg-card" />
    </Card>
  );
}
