// components/Layout.tsx
import React, { ReactNode } from "react";
import { ThemeToggle } from "../theme-toggle";
import { Card } from "../ui/card";

interface LayoutProps {
  children: ReactNode;
}

const GuestLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Card className="h-screen w-full rounded-none shadow-none border-none">
      <div className="absolute bottom-5 right-6">
        <ThemeToggle />
      </div>
      <div className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0 sm:px-0">
        <div className="w-full max-w-lg p-4">{children}</div>
      </div>
    </Card>
  );
};

export default GuestLayout;
