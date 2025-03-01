import React from "react";
import Navbar from "../navbar";
import { Toaster } from "@/components/ui/sonner";

export default function AuthenticatedLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main className="w-full">
        <div className="max-w-2xl mx-auto px-4 py-6">{children}</div>
        <Toaster className="bg-card" />
      </main>
    </div>
  );
}
