import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import GuestLayout from "@/components/layouts/GuestLayout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
const loginFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 character long")
    .max(20, "Username cannot be exceed than 20 character"),
  password: z.string().min(8, "Password must be at least 8 character long"),
  name: z
    .string()
    .min(3, "Name must be at least 3 character long")
    .max(100, "Username cannot be exceed than 100 character"),
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

export default function Login() {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  });

  const { handleSubmit, control } = form;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert(`Login successful: ${data.token}`);
    } catch (e) {
      alert((e as Error).message);
    }
  });

  return (
    <GuestLayout>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <Card className="min-w-[330px] max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Sign Up</CardTitle>
              <CardDescription>
                Enter your email below to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input type="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input type="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col">
              <Button className="w-full">Register</Button>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  className="underline underline-offset-4"
                  href="/auth/login"
                >
                  Login
                </Link>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </GuestLayout>
  );
}
