import { z } from "zod";

export const SeafoodSchema = z.object({
  id: z.string().ulid().optional(),
  name: z.string().min(1),
  imageUrl: z.string().min(1).optional(),
  price: z.bigint().min(BigInt(0)),
  unit: z.string().min(1),
  stock: z.bigint().min(BigInt(0)),
  sold: z.bigint().min(BigInt(0)),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Seafood = z.infer<typeof SeafoodSchema>;
