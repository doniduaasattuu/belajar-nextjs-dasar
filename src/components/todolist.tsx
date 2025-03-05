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
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSWR, { mutate } from "swr";
import { TodoDialog } from "./todo-dialog";

type Todo = {
  id: number;
  status: boolean;
  todo: string;
};

export default function TodolistPage() {
  const origin = window.location.origin;
  const fetcher = (url: string) =>
    fetch(url, {
      method: "GET",
    }).then((res) => res.json());

  const { data } = useSWR(`${origin}/api/todolists`, fetcher, {
    // refreshInterval: 6000,
  });
  const [isOpen, setIsOpen] = useState(false);
  const handleCloseDialog = () => {
    setIsOpen(false);
  };
  const handleNewTaskDialog = () => {
    setIsOpen(true);
  };

  const handleDelete = (todoId: number) => {
    try {
      mutate(
        `${origin}/api/todolists`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data: any) => {
          if (!data || !data.data) return data;

          localStorage.setItem(
            String(todoId),
            JSON.stringify(data.data.find((todo: Todo) => todo.id === todoId))
          );

          return {
            data: data.data.filter((todo: Todo) => todo.id !== todoId),
          };
        },
        false
      );

      toast.success("Success", {
        description: `Todo list successfully deleted.`,
        action: {
          label: "Undo",
          onClick: () => handleCancelDelete(todoId),
        },
      });

      fetch(`${origin}/api/todolists/${todoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deleting: true,
        }),
      });
    } catch (error) {
      toast.error("Error Occured", {
        description: String(error),
      });
    }
  };

  const handleCancelDelete = (todoId: number) => {
    try {
      const deletedTodo = localStorage.getItem(String(todoId));

      if (deletedTodo) {
        mutate(
          `${origin}/api/todolists`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data: any) => {
            if (!data || !data.data) return data;
            return {
              data: [JSON.parse(deletedTodo), ...data.data].sort(
                (a, b) => b.id - a.id
              ),
            };
          },
          false
        );

        localStorage.removeItem(String(todoId));
      }

      fetch(`${origin}/api/todolists/${todoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: todoId,
          undoing: true,
        }),
      });
    } catch (error) {
      toast.error("Error Occured", {
        description: String(error),
      });
    }
  };

  // HANDLE UPDATE
  const handleCheckboxChange = async (id: number, currentStatus: boolean) => {
    try {
      mutate(
        `${origin}/api/todolists`,
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

      const response = await fetch(`${origin}/api/todolists/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, status: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      toast.success("Success", {
        description: !currentStatus
          ? "Todo successfully marked as complete"
          : "Todo successfully marked as incomplete",
      });
      mutate(`${origin}/api/todolists`);
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
          <Button variant="outline" onClick={handleNewTaskDialog}>
            <Plus />
            New Task
          </Button>
        </div>

        <Table>
          <TableBody>
            {data && data?.data?.length > 0 ? (
              data?.data.map((todo: Todo) => (
                <TableRow key={todo.id} className="border-none">
                  <TableCell className="w-10">
                    <div className=" h-4 flex items-end">
                      <Checkbox
                        id={`${todo.id}`}
                        checked={todo.status}
                        onCheckedChange={() =>
                          handleCheckboxChange(todo.id, todo.status)
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Label htmlFor={`${todo.id}`}>{todo.todo}</Label>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleDelete(todo.id)}>
                          <Trash />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>Empty</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TodoDialog isOpen={isOpen} handleCloseDialog={handleCloseDialog} />
    </div>
  );
}
