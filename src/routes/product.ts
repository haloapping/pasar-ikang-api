import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prismaClient } from "../../prisma/client";
import { CreateProductSchema, ProductSchema, UpdateProductSchema } from "../types/product";
import { createNewSlug } from "../utils/slug";

export const productRoutes = new OpenAPIHono();

productRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    operationId: "Get all products",
    summary: "Get all products",
    description: "Get all products",
    tags: ["products"],
    responses: {
      200: {
        description: "Get all products response",
        content: {
          "application/json": {
            schema: z.object({ count: z.number().min(0), data: z.array(ProductSchema) }),
          },
        },
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    try {
      const products = await prismaClient.product.findMany();

      return c.json({ count: products.length, data: products });
    } catch (error) {
      return c.json({ error: error }, 400);
    }
  }
);

productRoutes.openapi(
  createRoute({
    method: "get",
    path: "/search",
    operationId: "Get produts by keyword",
    summary: "Get produts by keyword",
    description: "Get produts by keyword",
    tags: ["products"],
    request: { query: z.object({ q: z.string().min(0) }) },
    responses: {
      200: {
        description: "Get products by keyword",
        content: { "application/json": { schema: z.object({ data: z.array(ProductSchema) }) } },
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    const keyword = c.req.query("q");

    try {
      const products = await prismaClient.product.findMany({
        where: {
          OR: [
            { slug: { contains: keyword } },
            { name: { contains: keyword } },
            { imageUrl: { contains: keyword } },
            { unit: { contains: keyword } },
            { description: { contains: keyword } },
          ],
        },
      });

      return c.json({ count: products.length, data: products });
    } catch (error) {
      return c.json({ error: error }, 400);
    }
  }
);

productRoutes.openapi(
  createRoute({
    method: "get",
    path: "/:slug",
    operationId: "Get produt by slug",
    summary: "Get produt by slug",
    description: "Get product by slug",
    tags: ["products"],
    request: { params: z.object({ slug: z.string() }) },
    responses: {
      200: {
        description: "Get product by slug",
        content: { "application/json": { schema: z.object({ data: ProductSchema }) } },
      },
      404: {
        description: "Get product by slug not found",
      },
    },
  }),
  async (c) => {
    try {
      const slug = c.req.param("slug");
      const product = await prismaClient.product.findFirstOrThrow({
        where: { slug },
      });

      if (!product) {
        return c.json({ message: "Product not found" }, 404);
      }

      return c.json({ data: product }, 200);
    } catch (error) {
      return c.json({ error: error });
    }
  }
);

productRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",
    operationId: "Add new product",
    summary: "Add new product",
    description: "Add new product",
    tags: ["products"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateProductSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Add new product",
        content: { "application/json": { schema: z.object({ data: ProductSchema }) } },
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    try {
      const newProductJSON = c.req.valid("json");
      const newProduct = await prismaClient.product.create({
        data: {
          ...newProductJSON,
          slug: createNewSlug(newProductJSON.name),
        },
      });

      return c.json({ data: newProduct }, 200);
    } catch (error) {
      return c.json({ error: error }, 400);
    }
  }
);

productRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/:id",
    operationId: "Update product by id",
    summary: "Update product by id",
    description: "Update product by id",
    tags: ["products"],
    request: {
      params: z.object({ id: z.string().ulid() }),
      body: {
        content: {
          "application/json": {
            schema: UpdateProductSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Update product by id",
        content: { "application/json": { schema: z.object({ data: ProductSchema }) } },
      },
      404: {
        description: "Delete product by id not found",
      },
    },
  }),
  async (c) => {
    try {
      const id = c.req.param("id");
      const updateProductJSON = await c.req.json();
      const updatedProduct = await prismaClient.product.update({
        data: {
          ...updateProductJSON,
          slug: updateProductJSON.name ? createNewSlug(updateProductJSON.name) : undefined,
        },
        where: {
          id: id,
        },
      });

      return c.json({ data: updatedProduct }, 200);
    } catch (error) {
      return c.json({ error: error }, 400);
    }
  }
);

productRoutes.openapi(
  createRoute({
    method: "delete",
    path: "/:id",
    operationId: "Delete product by id",
    summary: "Delete product by id",
    description: "Delete product by id",
    tags: ["products"],
    request: { params: z.object({ id: z.string().ulid() }) },
    responses: {
      200: {
        description: "Delete product by id",
        content: { "application/json": { schema: z.object({ data: ProductSchema }) } },
      },
      404: {
        description: "Delete product by id not found",
      },
    },
  }),
  async (c) => {
    try {
      const id = c.req.param("id");
      const product = await prismaClient.product.delete({
        where: { id },
      });

      if (!product) {
        return c.json({ message: "Product not found" }, 404);
      }

      return c.json({ message: "Data is found", data: product }, 200);
    } catch (error) {
      return c.json({ error: error }, 400);
    }
  }
);
