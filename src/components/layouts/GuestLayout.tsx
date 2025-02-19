// components/Layout.tsx
import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const GuestLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0 sm:px-0">
      <div className="w-full max-w-lg p-4">{children}</div>
    </div>
  );
};

export default GuestLayout;
