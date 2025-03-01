import React, { useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "./ui/checkbox";
import { Edit, MoreVertical, Plus, Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchApiWithProgress } from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "./ui/textarea";
import { LoadingButton } from "./loading-button";
import { CreateTodolistSchema } from "@/validations/todolist-validation";
import useSWR, { mutate } from "swr";

type Todo = {
  id: number;
  status: boolean;
  todo: string;
};

const createTodolistSchema = CreateTodolistSchema;
type CreateTodolistSchema = z.infer<typeof createTodolistSchema>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TodolistPage() {
  const { data } = useSWR("http://localhost:3000/api/todolists", fetcher, {
    refreshInterval: 5000,
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleDialogTodo = () => {
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const handleDelete = async (todoId: number) => {
    try {
      mutate(
        "http://localhost:3000/api/todolists",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data: any) => {
          if (!data || !data.data) return data;

          return {
            data: data.data.filter((todo: Todo) => todo.id !== todoId),
          };
        },
        false
      );

      await fetch(`http://localhost:3000/api/todolists/${todoId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      mutate("http://localhost:3000/api/todolists");
      toast.success("Success", {
        description: `Todo list successfully deleted.`,
      });
    } catch (error) {
      toast.error("Error Occured", {
        description: String(error),
      });
    }
  };

  // HANDLE NEW TASK
  const form = useForm<CreateTodolistSchema>({
    resolver: zodResolver(createTodolistSchema),
  });

  const { handleSubmit, control, reset } = form;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      const response = await fetchApiWithProgress("/api/todolists", {
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
        description: "Todo list added successfully",
      });
      reset();
      mutate("http://localhost:3000/api/todolists");
    } catch (error) {
      toast.error("Error", {
        description: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
      handleCloseDialog();
    }
  });

  // HANDLE UPDATE
  const handleCheckboxChange = async (id: number, currentStatus: boolean) => {
    try {
      mutate(
        "http://localhost:3000/api/todolists",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data: any) => {
          if (!data || !data.data) return data;
          return {
            data: data.data.map((todo: Todo) =>
              todo.id === id ? { ...todo, status: !currentStatus } : todo
            ),
          };
        },
        false
      );

      await fetch(`http://localhost:3000/api/todolists/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, status: !currentStatus }),
      });

      // Revalidate SWR data
      mutate("http://localhost:3000/api/todolists");
      toast.success("Success", {
        description: !currentStatus
          ? "Todo successfully marked as complete"
          : "Todo successfully marked as incomplete",
      });
    } catch (e) {
      if (e instanceof Error) {
        toast.error("Failed to update status");
      }
    }
  };

  return (
    <div>
      <div className="max-w-2xl space-y-5">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              name="search"
              className="max-w-md"
              placeholder="Todo"
            />
          </div>
          <Button variant="outline" onClick={handleDialogTodo}>
            <Plus />
            New Task
          </Button>
        </div>

        <Table>
          <TableBody>
            {data && data?.data
              ? data?.data.map((todo: Todo) => (
                  <TableRow key={todo.id} className="border-none">
                    <TableCell className="w-10">
                      <div className=" h-4 flex items-end">
                        <Checkbox
                          checked={todo.status}
                          onCheckedChange={() =>
                            handleCheckboxChange(todo.id, todo.status)
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell>{todo.todo}</TableCell>
                    <TableCell className="text-right items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical size={18} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Action</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(todo.id)}
                          >
                            <Trash />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              : "Empty"}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card">
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
                        <Textarea {...field} className="col-span-3" />
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
                          <Label
                            htmlFor="status"
                            className="text-sm font-normal"
                          >
                            Mark as done
                          </Label>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <LoadingButton loading={isSubmitting} type="submit">
                  Insert
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );

  {
    /* <div className="flex space-x-2 items-center">
                    <Checkbox id="done" />
                    <Label htmlFor="done">Mark as done</Label>
                  </div> */
  }
}
