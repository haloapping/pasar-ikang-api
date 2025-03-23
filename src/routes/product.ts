import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { prismaClient } from "../../prisma/client";
import { type Product, ProductSchema } from "../types/product";

export const productRoutes = new Hono();

productRoutes.get("/", async (c) => {
  try {
    const result = await prismaClient.product.findMany();

    return c.json({ count: result.length, data: result });
  } catch (error) {
    return c.json({ error: error });
  }
});

productRoutes.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const result = await prismaClient.product.findFirstOrThrow({
      where: {
        id: id,
      },
    });

    if (!result) {
      return c.json({ message: "Product not found", data: result });
    }

    return c.json({ message: "Product found", data: result });
  } catch (error) {
    return c.json({ error: error });
  }
});

productRoutes.post("/", zValidator("json", ProductSchema), async (c) => {
  try {
    const productJSON: Product = await c.req.json();
    const result = await prismaClient.product.create({
      data: {
        ...productJSON,
      },
    });

    return c.json({ message: "Product is added", data: result });
  } catch (error) {
    return c.json({ error: error });
  }
});

productRoutes.patch("/:id", zValidator("json", ProductSchema), async (c) => {
  try {
    const id = c.req.param("id");
    const productJSON: Product = await c.req.json();
    const result = await prismaClient.product.update({
      data: {
        ...productJSON,
      },
      where: {
        id: id,
      },
    });

    return c.json({ message: "Product is updated", data: result });
  } catch (error) {}
});

productRoutes.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const result = await prismaClient.product.delete({
      where: {
        id: id,
      },
    });

    return c.json({ message: "Product is deleted", data: result });
  } catch (error) {
    return c.json({ error: error });
  }
});
