import { z } from "zod";

export const ShippingSchema = z.object({
  id: z.string().optional(),
  shippingMethod: z.string().min(1),
  price: z.bigint().min(BigInt(0)),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Shipping = z.infer<typeof ShippingSchema>;
