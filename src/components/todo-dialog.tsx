import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Checkbox } from "./ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTodolistSchema } from "@/validations/todolist-validation";
import z from "zod";
import { mutate } from "swr";
import { useState } from "react";
import { toast } from "sonner";
import { NewTodoDialogProps, Todo } from "./todolist";

const createTodolistSchema = CreateTodolistSchema;
type CreateTodolistSchema = z.infer<typeof createTodolistSchema>;

export function TodoDialog({
  isOpen,
  handleCloseDialog,
  endpoint,
}: NewTodoDialogProps) {
  const form = useForm<CreateTodolistSchema>({
    resolver: zodResolver(createTodolistSchema),
  });

  const { handleSubmit, control, reset } = form;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/todolists", {
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

      toast.success("Success", {
        description: data.restored
          ? "Task restored successfully"
          : "Task added successfully",
      });
      reset({
        todo: "",
        status: false,
      });

      const newTask: Todo = {
        id: data.data.id,
        todo: data.data.todo,
        status: data.data.status,
        created_at: data.data.created_at,
        deleted_at: data.data.deleted_at,
      };

      mutate(
        endpoint,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data: any) => {
          if (!data || !data.data) return data;

          return {
            data: {
              ...data,
              data: [...data.data, newTask],
            },
          };
        },
        true
      );

      handleCloseDialog();
    } catch (error) {
      toast.error("Error", {
        description: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[425px] top-0 translate-y-[50%] sm:top-[50%] sm:translate-y-[-50%] bg-card text-primary">
        {/* fixed top-[0%] md:top-auto translate-y-[50%] md:translate-y-0 */}
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>New Task</DialogTitle>
              <DialogDescription>
                Enter the details of your new task below.
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
              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="status"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="status" className="text-sm font-normal">
                          Mark as done
                        </Label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button disabled={isSubmitting} type="submit">
                Insert
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
