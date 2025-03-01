// components/Layout.tsx
import React, { ReactNode } from "react";
import { ThemeToggle } from "../theme-toggle";

interface LayoutProps {
  children: ReactNode;
}

const GuestLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0 sm:px-0">
      <div className="absolute bottom-5 right-6 color-auto">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-lg p-4">{children}</div>
    </div>
  );
};

export default GuestLayout;
