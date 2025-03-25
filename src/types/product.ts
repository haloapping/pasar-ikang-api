import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().ulid().optional(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  imageUrl: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  unit: z.string().min(1).optional(),
  stock: z.number().min(0).optional(),
  sold: z.number().min(0).optional(),
  description: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
