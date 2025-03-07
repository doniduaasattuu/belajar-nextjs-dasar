import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { EditTodoSchema } from "@/validations/todolist-validation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Todo, EditTodoDialogProps } from "./todolist";
import { toast } from "sonner";

const editTodoSchema = EditTodoSchema;
type EditTodoSchema = z.infer<typeof editTodoSchema>;

export default function TodoEditDialog({
  isOpen,
  handleCloseDialog,
  todo,
  mutate,
  endpoint,
}: EditTodoDialogProps) {
  const form = useForm<EditTodoSchema>({
    resolver: zodResolver(editTodoSchema),
    defaultValues: {
      todo: todo?.todo,
    },
  });

  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    reset({ todo: todo?.todo });
  }, [reset, todo]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      mutate(
        endpoint,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data: any) => {
          if (!data || !data.data) return data;

          return {
            data: data.data.map((item: Todo) =>
              item.id === todo?.id ? { ...item, todo: values.todo } : item
            ),
          };
        },
        false
      );

      if (todo?.todo.trim() !== values.todo.trim()) {
        const response = await fetch(`/api/todolists/${todo?.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: todo?.id,
            todo: values.todo,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        toast.success("Success", {
          description: data.message ?? "Successfully updated yaaa",
        });
      } else {
        toast.success("Success", {
          description: "Nothing changed",
        });
      }

      handleCloseDialog();
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error", {
          description: error.message,
        });
      }
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[425px] top-0 translate-y-[50%] sm:top-[50%] sm:translate-y-[-50%] bg-card text-primary">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>Edit task</DialogTitle>
              <DialogDescription>
                Update the details of your task below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 my-5">
              <FormField
                control={control}
                name="todo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task</FormLabel>
                    <FormControl>
                      <Input {...field} className="col-span-3" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
