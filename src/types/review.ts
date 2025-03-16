import { z } from "zod";

export const ReviewSchema = z.object({
  id: z.string().ulid().optional(),
  customerId: z.string().ulid(),
  seafoodId: z.string().ulid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Review = z.infer<typeof ReviewSchema>;
