import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prismaClient } from "../../prisma/client";
import { CreateUserSchema, UserSchema, UpdateUserSchema } from "../types/user";

export const userRoutes = new OpenAPIHono();

userRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    operationId: "Get all users",
    summary: "Get all users",
    description: "Get all users",
    tags: ["users"],
    responses: {
      200: {
        description: "Get all users",
        content: { "application/json": { schema: z.object({ data: z.array(UserSchema) }) } },
      },
    },
  }),
  async (c) => {
    const users = await prismaClient.user.findMany();

    return c.json({ data: users }, 200);
  }
);

userRoutes.openapi(
  createRoute({
    method: "get",
    path: "/:id",
    operationId: "Get user by id",
    summary: "Get user by id",
    description: "Get user by id",
    tags: ["users"],
    request: { params: z.object({ id: z.string() }) },
    responses: {
      200: {
        description: "Get user by id",
        content: { "application/json": { schema: z.object({ data: z.array(UserSchema) }) } },
      },
      404: {
        description: "Get user by slug not found",
      },
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const user = await prismaClient.user.findFirstOrThrow({
      where: { id },
    });

    if (!user) {
      return c.json({ message: "user not found" }, 404);
    }

    return c.json({ data: user }, 200);
  }
);

userRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",
    operationId: "Add new user",
    summary: "Add new user",
    description: "Add new user",
    tags: ["users"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateUserSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Add new user",
        content: { "application/json": { schema: z.object({ data: UserSchema }) } },
      },
    },
  }),
  async (c) => {
    const newUserJSON = c.req.valid("json");
    const newUser = await prismaClient.user.create({
      data: {
        ...newUserJSON,
      },
    });

    // create cart
    const cart = await prismaClient.cart.create({
      data: {
        userId: newUser.id,
      },
    });

    return c.json({ data: newUser }, 200);
  }
);

userRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/:id",
    operationId: "Update user by id",
    summary: "Update user by id",
    description: "Update user by id",
    tags: ["users"],
    request: {
      params: z.object({ id: z.string().ulid() }),
      body: {
        content: {
          "application/json": {
            schema: UpdateUserSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Update user by id",
        content: { "application/json": { schema: z.object({ data: UserSchema }) } },
      },
    },
  }),
  async (c) => {
    try {
      const id = c.req.param("id");
      const updateCustomerJSON = await c.req.json();
      const updatedCustomer = await prismaClient.user.update({
        data: {
          ...updateCustomerJSON,
        },
        where: {
          id: id,
        },
      });

      return c.json({ data: updatedCustomer }, 200);
    } catch (error) {
      return c.json({ error: error });
    }
  }
);

userRoutes.openapi(
  createRoute({
    method: "delete",
    path: "/:id",
    operationId: "Delete user by id",
    summary: "Delete user by id",
    description: "Delete user by id",
    tags: ["users"],
    request: { params: z.object({ id: z.string().ulid() }) },
    responses: {
      200: {
        description: "Delete user by id",
        content: { "application/json": { schema: z.object({ data: UserSchema }) } },
      },
      404: {
        description: "Delete user by id not found",
      },
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const user = await prismaClient.user.delete({
      where: { id },
    });

    if (!user) {
      return c.json({ message: "user not found" }, 404);
    }

    return c.json({ data: user }, 200);
  }
);
