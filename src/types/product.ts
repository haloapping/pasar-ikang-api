import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().ulid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  imageUrl: z.string().min(1),
  price: z.bigint().min(BigInt(0)),
  unit: z.string().min(1),
  stock: z.bigint().min(BigInt(0)),
  sold: z.bigint().min(BigInt(0)),
  description: z.string(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
