import { z } from "zod";

export const OrderSeafoodSchema = z.object({
  id: z.string().ulid().optional(),
  orderId: z.string().ulid(),
  seafoodId: z.string().ulid(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type OrderSeafood = z.infer<typeof OrderSeafoodSchema>;
