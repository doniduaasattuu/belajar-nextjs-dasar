import { z, ZodType } from "zod";

export const BaseUserSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .toLowerCase()
    .trim()
    .refine((value: string) => !/\s/.test(value), {
      message: "String cannot contain spaces",
    }),
  name: z.string().min(3).max(100),
  password: z.string().min(8),
});

export const RegisterUserSchema = BaseUserSchema;

export const LoginUserSchema = BaseUserSchema.pick({
  username: true,
  password: true,
});

export class UserValidation {
  static readonly REGISTER: ZodType = RegisterUserSchema;
  static readonly LOGIN: ZodType = LoginUserSchema;
}
