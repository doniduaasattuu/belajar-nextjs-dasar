import * as React from "react";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateUserSchema } from "@/validations/user-validation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

const updateFormSchema = UpdateUserSchema;
type UpdateFormSchema = z.infer<typeof updateFormSchema>;

export default function ProfilePage() {
  const form = useForm<UpdateFormSchema>({
    resolver: zodResolver(updateFormSchema),
  });

  const { handleSubmit, control } = form;

  const onSubmit = handleSubmit(async (values) => {
    console.log(values);
  });
  return (
    <AuthenticatedLayout>
      <div className="mb-6">
        <div className="font-semibold">Profile</div>
        <p className="text-sm text-muted-foreground">
          Update profile and information
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-3">
          <FormField
            control={control}
            name="username"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update</Button>
        </form>
      </Form>
    </AuthenticatedLayout>
  );
}
