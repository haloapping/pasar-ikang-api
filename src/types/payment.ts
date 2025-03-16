import { z } from "zod";

export const PaymentSchema = z.object({
  id: z.string().ulid().optional(),
  paymentMethod: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Payment = z.infer<typeof PaymentSchema>;
