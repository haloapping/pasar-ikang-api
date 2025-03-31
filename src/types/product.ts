import { z } from "zod";

export const ProductSchema = z
  .object({
    id: z.string().ulid().openapi({ example: "01JQEDNX6YYEXRKEA3WA1BBM1A" }),
    slug: z.string().min(1).nullable().openapi({ example: "ikan-gurame-segar", uniqueItems: true }),
    name: z.string().min(1).openapi({ example: "Ikan Gurame Segar", uniqueItems: true }),
    imageUrl: z
      .string()
      .url()
      .openapi({ example: "https://ik.imagekit.io/xc0cxidhx/pasar-ikang/ikan-gurame-segar.webp" }),
    price: z.number().openapi({ example: 46900 }),
    unit: z.string().openapi({ example: "gr" }),
    description: z.string().min(1).nullable().openapi({
      example:
        "Ikan Gurame lokal beku utuh. Sisik dan isi perut sudah dibersihkan. Cocok dimasak gulai, bumbu kuning, pesmol, ikan bakar, ikan goreng, dan lain-lain. Berat produk dapat berkurang 10% dari berat beku.",
    }),
    stock: z.number().min(0).openapi({ example: 100 }),
    sold: z.number().min(0).openapi({ example: 100 }),
    createdAt: z.string().datetime().openapi({ example: "2025-03-28 13:04:51.934" }),
    updatedAt: z.string().datetime().openapi({ example: "2025-03-28 13:06:14.449" }),
  })
  .strict();

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
}).strict();

export const UpdateProductSchema = CreateProductSchema.partial().strict();
