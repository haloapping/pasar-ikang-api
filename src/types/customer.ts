import { z } from "zod";

export const CustomerSchema = z.object({
  id: z.string().ulid().optional(),
  username: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1).optional(),
  avatarUrl: z.string().min(1).optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Customer = z.infer<typeof CustomerSchema>;
