import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { fetchApiWithProgress } from "@/lib/api";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const handleLogout = async () => {
    const response = await fetchApiWithProgress("/api/auth/logout", {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/auth/login");
    }
  };

  return (
    <nav className="w-full bg-card">
      <Card className="container mx-auto py-3 px-4 border-0 flex items-center justify-between gap-6 rounded-none shadow-none">
        <div className="flex md:hidden mr-2 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5 rotate-0 scale-100" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <a href="#home">Home</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#features">Features</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#pricing">Pricing</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#faqs">FAQs</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button variant="secondary" className="w-full text-sm">
                  Login
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ul className="hidden md:flex items-center gap-10 text-card-foreground">
          <div className="text-md font-semibold me-5">TodolistApp</div>

          <li>
            <Link className="text-sm" href="/home">
              Home
            </Link>
          </li>
          <li>
            <Link className="text-sm" href="/features">
              Features
            </Link>
          </li>
          <li>
            <Link className="text-sm" href="/pricing">
              Pricing
            </Link>
          </li>
          <li>
            <Link className="text-sm" href="/faqs">
              FAQs
            </Link>
          </li>
        </ul>

        <div className="flex items-center space-x-3">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <a href="/profile">Profile</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div onClick={handleLogout}>Logout</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </nav>
  );
};

export default Navbar;
