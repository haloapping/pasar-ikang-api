import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prismaClient } from "../../prisma/client";
import { checkAuthorized } from "../middleware/auth";
import { AddToCartSchema, CartSchema } from "../types/cart";

export const cartRoutes = new OpenAPIHono();

cartRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    operationId: "Get cart by user id",
    summary: "Get cart by user id",
    description: "Get cart by user id",
    tags: ["cart"],
    middleware: checkAuthorized,
    request: {
      headers: z.object({
        Authorization: z
          .string()
          .regex(/^Bearer .+$/)
          .openapi({
            description: "Bearer token for authentication",
            example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          }),
      }),
    },
    responses: {
      200: {
        description: "Get cart by user id",
        content: { "application/json": { schema: CartSchema } },
      },
      400: {
        description: "Bad request",
      },
    },
  }),
  async (c) => {
    try {
      const user = c.get("user");

      const cart = await prismaClient.cart.findFirst({
        where: { userId: user.id },
        include: { items: { include: { product: true } } },
      });

      if (!cart) {
        const newCart = await prismaClient.cart.create({
          data: { userId: user.id },
          include: { items: { include: { product: true } } },
        });

        return c.json({ ...newCart }, 200);
      }

      return c.json({ ...cart }, 200);
    } catch (error) {
      return c.json({ error: error });
    }
  }
);

cartRoutes.openapi(
  createRoute({
    method: "post",
    path: "/items",
    middleware: checkAuthorized,
    operationId: "Add cart item",
    summary: "Add cart item",
    description: "Add cart item",
    tags: ["cart"],
    request: {
      headers: z.object({
        Authorization: z
          .string()
          .regex(/^Bearer .+$/)
          .openapi({
            description: "Bearer token for authentication",
            example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          }),
      }),
      body: { content: { "application/json": { schema: AddToCartSchema } } },
    },
    responses: {
      200: {
        description: "Add cart item",
        content: { "application/json": { schema: CartSchema } },
      },
      400: {
        description: "Failed to add item to cart",
      },
    },
  }),
  async (c) => {
    try {
      const body = c.req.valid("json");
      const user = c.get("user");

      const cart = await prismaClient.cart.findFirst({
        where: { userId: user.id },
      });

      if (!cart) {
        return c.json({ message: "Cart not found" }, 400);
      }

      const newCartItem = await prismaClient.cartItem.create({
        data: {
          cartId: cart.id,
          productId: body.productId,
          quantity: body.quantity,
        },
        include: { product: true },
      });

      return c.json(newCartItem);
    } catch (error) {
      return c.json({ message: "Failed to add item to cart" }, 400);
    }
  }
);
