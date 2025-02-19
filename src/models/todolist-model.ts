import { User } from "./user-model";

export type Todolist = {
  id: number;
  todo: string;
  username: User;
  created_at: string;
  updated_at: string;
};
