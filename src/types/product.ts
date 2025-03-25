import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().ulid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  imageUrl: z.string().min(1),
  price: z.number().min(0),
  unit: z.string().min(1),
  stock: z.number().min(0),
  sold: z.number().min(0),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Product = z.infer<typeof ProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
