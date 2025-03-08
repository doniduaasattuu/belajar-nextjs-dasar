import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { Card } from "../ui/card";
import { Navbar, NavbarLeft, NavbarRight } from "../ui/navbar";
import { ThemeToggle } from "../theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const handleLogout = async () => {
  const baseUrl = window.location.origin;
  signOut({ callbackUrl: `${baseUrl}/auth/login` });
};

export default function AuthenticatedLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const { data } = useSession();
  const name = data?.user?.name;

  return (
    <Card className="w-full min-h-screen rounded-none shadow-none border-none">
      <Navbar className="max-w-2xl px-4 mx-auto">
        <NavbarLeft>
          <div
            className="font-semibold cursor-pointer text-lg"
            onClick={() => router.push("/todolists")}
          >
            TodolistApp
          </div>
        </NavbarLeft>
        <NavbarRight>
          <div className="flex items-center space-x-3">
            <div className="font-normal text-sm text-muted-foreground">
              {name}
            </div>
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-9 w-9">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/auth/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </NavbarRight>
      </Navbar>
      <div className="max-w-2xl mx-auto px-4 py-6">{children}</div>
      <Toaster className="bg-card" />
    </Card>
  );
}
