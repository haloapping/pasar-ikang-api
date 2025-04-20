import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prismaClient } from "../../prisma/client";
import { UserSchema } from "../types/user";

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
        content: { "application/json": { schema: z.object({ data: UserSchema }) } },
      },
      404: {
        description: "Get user by id not found",
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
