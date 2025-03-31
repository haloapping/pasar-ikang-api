import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prismaClient } from "../../prisma/client";
import { CreateProductSchema, ProductSchema, UpdateProductSchema } from "../types/product";
import { createNewSlug } from "../utils/slug";

export const productRoutes = new OpenAPIHono();

productRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    description: "Get all products",
    tags: ["products"],
    responses: {
      200: {
        description: "Get all products response",
        content: { "application/json": { schema: z.array(ProductSchema) } },
      },
    },
  }),
  async (c) => {
    const products = await prismaClient.product.findMany();

    return c.json(products);
  }
);

productRoutes.openapi(
  createRoute({
    method: "get",
    path: "/:slug",
    description: "Get product by slug",
    tags: ["products"],
    request: { params: z.object({ slug: z.string() }) },
    responses: {
      200: {
        description: "Get product by slug",
        content: { "application/json": { schema: ProductSchema } },
      },
      404: {
        description: "Get product by slug not found",
      },
    },
  }),
  async (c) => {
    const slug = c.req.param("slug");
    const product = await prismaClient.product.findFirstOrThrow({
      where: { slug },
    });

    if (!product) {
      return c.json({ message: "Product not found" }, 404);
    }

    return c.json(product);
  }
);

productRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",
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
        content: { "application/json": { schema: ProductSchema } },
      },
    },
  }),
  async (c) => {
    const newProductJSON = c.req.valid("json");
    const newProduct = await prismaClient.product.create({
      data: {
        ...newProductJSON,
        slug: createNewSlug(newProductJSON.name),
      },
    });

    return c.json(newProduct);
  }
);

productRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/:id",
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
        content: { "application/json": { schema: ProductSchema } },
      },
    },
  }),
  async (c) => {
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

    return c.json(updatedProduct);
  }
);

productRoutes.openapi(
  createRoute({
    method: "delete",
    path: "/:id",
    description: "Delete product by id",
    tags: ["products"],
    request: { params: z.object({ id: z.string().ulid() }) },
    responses: {
      200: {
        description: "Delete product by id",
        content: { "application/json": { schema: ProductSchema } },
      },
      404: {
        description: "Delete product by id not found",
      },
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const product = await prismaClient.product.delete({
      where: { id },
    });

    if (!product) {
      return c.json({ message: "Product not found" }, 404);
    }

    return c.json(product);
  }
);
