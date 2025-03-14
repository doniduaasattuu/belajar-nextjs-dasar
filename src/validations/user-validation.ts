import { z, ZodType } from "zod";

const MAX_FILE_IN_MB: number = 5;
const MAX_FILE_SIZE: number = MAX_FILE_IN_MB * 1024 * 1024;

export const BaseUserSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .min(3)
    .max(20)
    .toLowerCase()
    .trim()
    .refine((value: string) => !/\s/.test(value), {
      message: "String cannot contain spaces",
    }),
  name: z.string({ message: "Name is required" }).min(3).max(100),
  password: z.string({ message: "Password is required" }).min(8),
  new_password: z.string({ message: "New Password is required" }).min(8),
  image: z.instanceof(File).optional(),
});

export const RegisterUserSchema = BaseUserSchema.pick({
  username: true,
  name: true,
  password: true,
})
  .extend({
    confirm: z.string().min(8),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Password don't match",
    path: ["confirm"],
  });

export const LoginUserSchema = BaseUserSchema.pick({
  username: true,
  password: true,
});

export const UpdateUserSchema = BaseUserSchema.pick({
  username: true,
  name: true,
  image: true,
}).refine(
  (data) => !data.image || data.image.size <= MAX_FILE_SIZE, // 2MB
  {
    message: `File size has exceeded it max limit of ${MAX_FILE_IN_MB}MB`,
    path: ["image"],
  }
);

export const UpdatePasswordSchema = BaseUserSchema.pick({
  password: true,
  new_password: true,
})
  .extend({
    confirm: z.string().min(8),
  })
  .refine((data) => data.new_password === data.confirm, {
    message: "Password don't match",
    path: ["confirm"],
  });

export class UserValidation {
  static readonly REGISTER: ZodType = RegisterUserSchema;
  static readonly LOGIN: ZodType = LoginUserSchema;
  static readonly UPDATE: ZodType = UpdateUserSchema;
}
