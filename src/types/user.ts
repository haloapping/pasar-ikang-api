import { z } from "@hono/zod-openapi";

export const UserSchema = z
  .object({
    id: z.string().ulid().openapi({ example: "01JQMYFGBJA8SX5PS8PYGYV5WE" }),
    username: z.string().min(1).openapi({ example: "fufufafa", uniqueItems: true }),
    email: z.string().email().openapi({ example: "fufufafa@co.id", uniqueItems: true }),
    password: z.string(),
    firstName: z.string().min(1).openapi({ example: "Prabowo" }),
    lastName: z.string().min(1).nullable().openapi({ example: "Gibran" }),
    avatarUrl: z
      .string()
      .url()
      .nullable()
      .openapi({ example: "https://ik.imagekit.io/xc0cxidhx/pasar-ikang/customers/fufufafa.webp" }),
    createdAt: z.string().datetime().openapi({ example: "2025-03-28 13:04:51.934" }),
    updatedAt: z.string().datetime().openapi({ example: "2025-03-28 13:06:14.449" }),
  })
  .strict();

export const CreateUserSchema = z
  .object({
    username: z.string().min(1).openapi({ example: "fufufafa", uniqueItems: true }),
    email: z.string().email().openapi({ example: "fufufafa@co.id", uniqueItems: true }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      })
      .refine((val) => !/\s/.test(val), {
        message: "Password must not contain spaces",
      }),
    firstName: z.string().min(1).openapi({ example: "Prabowo" }),
    lastName: z.string().min(1).nullable().openapi({ example: "Gibran" }),
    avatarUrl: z
      .string()
      .url()
      .nullable()
      .openapi({ example: "https://ik.imagekit.io/xc0cxidhx/pasar-ikang/customers/fufufafa.webp" }),
  })
  .strict();

export const UpdateUserSchema = CreateUserSchema.partial().strict();

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
