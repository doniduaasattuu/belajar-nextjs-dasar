import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "./ui/checkbox";
import { Edit, MoreVertical, Plus, Settings2, Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSWR, { mutate, ScopedMutator } from "swr";
import { TodoDialog } from "./todo-dialog";
import TodoEditDialog from "./todo-edit-dialog";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

export type Todo = {
  id: number;
  status: boolean;
  todo: string;
};

export type NewTodoDialogProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
};

export type EditTodoDialogProps = {
  isOpen: boolean;
  handleCloseDialog: () => void;
  todo: Todo | undefined;
  mutate: ScopedMutator;
};

export default function TodolistPage() {
  const origin = window.location.origin;
  const fetcher = (url: string) =>
    fetch(url, {
      method: "GET",
    }).then((res) => res.json());

  type Checked = DropdownMenuCheckboxItemProps["checked"];
  const [withTrashed, setWithTrashed] = React.useState<Checked>(false);
  const [order, setOrder] = React.useState<string>("asc");

  const endpoint = `${origin}/api/todolists?withTrashed=${withTrashed}&order=${order}`;
  const { data } = useSWR(endpoint, fetcher, {
    // refreshInterval: 5000,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editedTask, setEditedTask] = useState<Todo>();

  const handleCloseDialog = () => {
    setIsOpen(false);
    setIsEdit(false);
  };

  const handleNewTaskDialog = () => {
    setIsOpen(true);
  };
  const handleEditTaskDialog = (todo: Todo) => {
    setEditedTask(todo);
    setIsEdit(true);
  };

  const handleDelete = (todoId: number) => {
    try {
      mutate(
        endpoint,
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
          endpoint,
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
        endpoint,
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
      mutate(endpoint);
    } catch (e) {
      if (e instanceof Error) {
        toast.error("Failed to update status");
      }
    }
  };

  // HANDLE SEARCH
  const [searchTerm, setSearchTerm] = useState<string | undefined>();

  useEffect(() => {
    if (searchTerm) {
      mutate(
        endpoint,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data: any) => {
          if (!data || !data.data) return data;

          return {
            data: data.data.filter((todo: Todo) =>
              todo.todo.toLowerCase().includes(searchTerm.toLowerCase())
            ),
          };
        },
        false
      );
    } else {
      mutate(endpoint);
    }
  }, [endpoint, origin, searchTerm]);

  return (
    <div>
      <div className="max-w-2xl space-y-5">
        <div className="flex justify-between items-end space-x-2">
          <div className="space-y-1">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
              placeholder="Task"
            />
          </div>
          <div className="space-x-2 min-w-max">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="icon">
                  <Settings2 />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sorted by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={order} onValueChange={setOrder}>
                  <DropdownMenuRadioItem value="asc">
                    Ascending
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="desc">
                    Descending
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={withTrashed}
                  onCheckedChange={setWithTrashed}
                >
                  With Trashed
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={handleNewTaskDialog}>
              <Plus />
              New Task
            </Button>
          </div>
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
                        <DropdownMenuItem
                          onClick={() => handleEditTaskDialog(todo)}
                        >
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

      <TodoEditDialog
        mutate={mutate}
        todo={editedTask}
        isOpen={isEdit}
        handleCloseDialog={handleCloseDialog}
      />
    </div>
  );
}
