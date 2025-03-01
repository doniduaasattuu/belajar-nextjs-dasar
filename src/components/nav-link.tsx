"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive: boolean = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        `text-sm transition-colors rounded-sm ${
          isActive
            ? "text-primary font-medium"
            : "text-muted-foreground hover:text-primary"
        }`,
        className
      )}
    >
      {children}
    </Link>
  );
}
