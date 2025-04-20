import { z } from "zod";

export const RegisterSchema = z.object({
  firstName: z.string().min(1).openapi({ example: "Apping" }),
  lastName: z.string().min(1).openapi({ example: "Appong" }),
  username: z.string().min(1).openapi({ example: "ping" }),
  email: z.string().email().openapi({ example: "ping@haloapping.com" }),
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
    })
    .openapi({ example: "ABCabc123!" }),
  confirmPassword: z
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
    })
    .optional()
    .openapi({ example: "ABCabc123!" }),
});

export const LoginSchema = z.object({
  username: z.string().openapi({ example: "ping" }),
  password: z.string().openapi({ example: "ABCabc123!" }),
});
