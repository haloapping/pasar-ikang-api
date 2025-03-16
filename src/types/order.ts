import { z } from "zod";

export const OrderSchema = z.object({
  id: z.string().ulid().optional(),
  customerId: z.string().ulid(),
  seafoodId: z.string().ulid(),
  paymentId: z.string().ulid(),
  shippingId: z.string().ulid(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Order = z.infer<typeof OrderSchema>;
