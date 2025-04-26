import { z } from "zod";

export const CartSchema = z
  .object({
    id: z.string().ulid().openapi({ example: "01JQEDNX6YYEXRKEA3WA1BBM1A" }),
    userId: z.string().ulid().openapi({ example: "01JQEDNX6YYEXRKEA3WA1BBM1A" }),
    createdAt: z.string().datetime().openapi({ example: "2025-03-28 13:04:51.934" }),
    updatedAt: z.string().datetime().openapi({ example: "2025-03-28 13:06:14.449" }),
  })
  .strict();

export const CreateCartSchema = CartSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).strict();

export const UpdateCartSchema = CreateCartSchema.partial().strict();

export const AddToCartSchema = z.object({
  productId: z.string().ulid(),
  quantity: z.number(),
});

export type CartSchema = z.infer<typeof CartSchema>;
export type CreateCartSchema = z.infer<typeof CreateCartSchema>;
export type UpdateCartSchema = z.infer<typeof UpdateCartSchema>;
export type AddToCart = z.infer<typeof AddToCartSchema>;
