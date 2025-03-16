import { z } from "zod";

export const AddressSchema = z.object({
  id: z.string().ulid().optional(),
  customerId: z.string().ulid(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(5).max(5),
  country: z.string().min(1),
  detail: z.string().min(1).optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Address = z.infer<typeof AddressSchema>;
