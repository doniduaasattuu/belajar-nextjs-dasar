import * as React from "react";

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
import { z } from "zod";
import { RegisterUserSchema } from "@/validations/user-validation";
import { AlertDestructive } from "@/components/alert-destructive";
import { LoadingButton } from "@/components/loading-button";
import { useRouter } from "next/router";
import { fetchApiWithProgress } from "@/lib/api";

export const registerFormSchema = RegisterUserSchema;
type RegisterFormSchema = z.infer<typeof registerFormSchema>;

export default function Register() {
  const router = useRouter();
  const [error, setError] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
  });

  const { handleSubmit, control } = form;

  const onSubmit = handleSubmit(async (values) => {
    setIsLoading(true);
    try {
      const response = await fetchApiWithProgress("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      localStorage.setItem("user", JSON.stringify(data.data));
      router.push("/auth/login");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <GuestLayout>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <Card className="min-w-[330px] max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Enter your data below to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-3">
                  <AlertDestructive message={error} />
                </div>
              )}
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
                  name="confirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col">
              <LoadingButton className="w-full" loading={isLoading}>
                Register
              </LoadingButton>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  className="underline underline-offset-4"
                  href="/auth/login"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </GuestLayout>
  );
}
