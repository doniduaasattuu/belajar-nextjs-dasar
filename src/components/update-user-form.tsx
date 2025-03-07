import React from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UpdateUserSchema } from "@/validations/user-validation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const updateFormSchema = UpdateUserSchema;
type UpdateFormSchema = z.infer<typeof updateFormSchema>;

export default function UpdateUserForm() {
  const { data, update } = useSession();
  const user = data?.user;

  // UPDATE USER FORM
  const updateUserForm = useForm<UpdateFormSchema>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      username: "",
      name: "",
    },
  });

  React.useEffect(() => {
    if (user) {
      updateUserForm.reset({
        username: user.username,
        name: user.name ?? "",
      });
    }
  }, [user, updateUserForm]);

  const { handleSubmit, control, setError } = updateUserForm;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.field) {
          setError(result.field, { type: "server", message: result.message });
        }
        return;
      }

      toast.success("Success", {
        description: "Profile successfully updated",
      });

      await update({ user: { ...data?.user, name: result.data.name } });
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error", {
          description: error.message,
        });
      }
    }
  });

  return (
    <Form {...updateUserForm}>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          control={control}
          name="username"
          render={({ field }) => (
            <FormItem className="max-w-md">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} readOnly disabled />
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

        <div className="pt-3">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
