import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { NavLink } from "./nav-link";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";

const Navbar = () => {
  const { data: user } = useSession();
  const name = user?.user.name;

  const handleLogout = async () => {
    const baseUrl = window.location.origin;
    signOut({ callbackUrl: `${baseUrl}/` });
  };

  const navigations = [
    {
      href: "/todolists",
      label: "Home",
    },
  ];

  return (
    <nav className={"w-full bg-card"}>
      <Card className="container max-w-2xl mx-auto py-2 px-4 flex items-center justify-between gap-6 rounded-none shadow-none border-0">
        <div className="flex md:hidden mr-2 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5 rotate-0 scale-100" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              {navigations.map((nav, index) => {
                return (
                  <DropdownMenuItem asChild key={index}>
                    <NavLink href={nav.href}>{nav.label}</NavLink>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ul className="hidden md:flex items-center gap-10 text-card-foreground">
          <div className="text-md font-semibold me-5">TodolistApp</div>
          {navigations.map((nav, index) => {
            return (
              <li key={index}>
                <NavLink className="py-2 px-1" href={nav.href}>
                  {nav.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
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
              <DropdownMenuItem asChild>
                <Link href="/auth/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </nav>
  );
};

export default Navbar;
