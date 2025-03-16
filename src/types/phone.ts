import { z } from "zod";

export const PhoneSchema = z.object({
  id: z.string().ulid().optional(),
  customerId: z.string().ulid(),
  phoneNumber: z.string().min(5),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Phone = z.infer<typeof PhoneSchema>;
