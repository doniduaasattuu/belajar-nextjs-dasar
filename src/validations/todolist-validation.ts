import { z } from "zod";

export const BaseTodolistSchema = z.object({
  todo: z
    .string()
    .min(10, "Task must contain at least 10 character(s)")
    .max(100, "Task must be at most 100 characters"),
  status: z.boolean().default(false),
});

export const CreateTodolistSchema = BaseTodolistSchema;
