import { z } from "zod";

export const CustomerContactSchema = z.object({
  id: z.string().ulid().optional(),
  customerId: z.string().ulid(),
  phoneNumber: z.string().min(5).max(12),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
  detail: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CustomerContact = z.infer<typeof CustomerContactSchema>;
