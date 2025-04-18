import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prismaClient } from "../../prisma/client";
import { AddToCart, AddToCartSchema, CartSchema } from "../types/cart";

export const cartRoutes = new OpenAPIHono();

cartRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    operationId: "Get all carts",
    summary: "Get all carts",
    description: "Get all carts",
    tags: ["carts"],
    responses: {
      200: {
        description: "Get all carts",
        content: { "application/json": { schema: z.object({ data: z.array(CartSchema) }) } },
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    try {
      const carts = await prismaClient.cart.findMany();

      return c.json({ data: carts }, 200);
    } catch (error) {
      return c.json({ error: error });
    }
  }
);

cartRoutes.openapi(
  createRoute({
    method: "get",
    path: "/:userId",
    operationId: "Get all cart products by user id",
    summary: "Get all cart products by user id",
    description: "Get all cart products by user id",
    tags: ["carts"],
    request: { params: z.object({ userId: z.string().ulid() }) },
    responses: {
      200: {
        description: "Get all cart products by user id",
        content: { "application/json": { schema: z.array(CartSchema) } },
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    try {
      const userId = c.req.param("userId");
      const cartItems = await prismaClient.cartItem.findMany({
        where: {
          userId: userId,
        },
        include: {
          product: true,
        },
      });

      const productsWithQuantities = cartItems.map((item) => ({
        ...item.product,
        quantity: item.quantity,
      }));

      return c.json({ data: productsWithQuantities }, 200);
    } catch (error) {
      return c.json({ error: error });
    }
  }
);

cartRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",
    operationId: "Add product to cart",
    summary: "Add product to cart",
    description: "Add product to cart",
    tags: ["carts"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: AddToCartSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Add product to cart",
        content: { "application/json": { schema: z.object({ quantity: z.number() }) } },
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    const productCartJson: AddToCart = await c.req.json();

    console.log(productCartJson);

    try {
      const cartItem = await prismaClient.cartItem.create({
        data: {
          userId: productCartJson.userId,
          cartId: productCartJson.userId,
          productId: productCartJson.productId,
          quantity: productCartJson.quantity,
          isProcessed: false,
        },
      });

      return c.json({ data: cartItem }, 200);
    } catch (error) {
      return c.json({ error: error });
    }
  }
);
