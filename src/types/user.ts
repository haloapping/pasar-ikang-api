import { z } from "@hono/zod-openapi";

export const UserSchema = z
  .object({
    id: z.string().ulid().openapi({ example: "01JQMYFGBJA8SX5PS8PYGYV5WE" }),
    username: z.string().min(1).openapi({ example: "ping", uniqueItems: true }),
    email: z.string().email().openapi({ example: "ping@haloapping.com", uniqueItems: true }),
    firstName: z.string().min(1).openapi({ example: "Apping" }),
    lastName: z.string().min(1).nullable().openapi({ example: "Appong" }),
    avatarUrl: z
      .string()
      .url()
      .nullable()
      .openapi({ example: "https://ik.imagekit.io/xc0cxidhx/pasar-ikang/users/avatar.webp" }),
    createdAt: z.date().openapi({ example: "2025-03-28 13:04:51.934" }),
    updatedAt: z.date().openapi({ example: "2025-03-28 13:06:14.449" }),
  })
  .strict();

export type User = z.infer<typeof UserSchema>;
