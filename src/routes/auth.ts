import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { sign } from "hono/jwt";
import { prismaClient } from "../../prisma/client";
import { checkAuthorized } from "../middleware/auth";
import { LoginSchema, RegisterSchema } from "../types/auth";
import { UserSchema } from "../types/user";
import { hashPassword, verifyPassword } from "../utils/password";

export const authRoutes = new OpenAPIHono();

authRoutes.openapi(
  createRoute({
    method: "post",
    path: "/register",
    operationId: "Register user",
    summary: "Register user",
    description: "Register user",
    tags: ["auth"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: RegisterSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Get user by id",
        content: { "application/json": { schema: UserSchema } },
      },
      404: {
        description: "Get user by slug not found",
      },
    },
  }),
  async (c) => {
    const registerUser = c.req.valid("json");

    if (registerUser.password !== registerUser.confirmPassword) {
      return c.json({ message: "Password and confirm password is not match" }, 400);
    }

    delete registerUser.confirmPassword;

    const newUser = await prismaClient.user.create({
      data: {
        ...registerUser,
        password: {
          create: {
            hash: await hashPassword(registerUser.password),
          },
        },
      },
    });

    return c.json({ data: newUser }, 200);
  }
);

authRoutes.openapi(
  createRoute({
    method: "post",
    path: "/login",
    operationId: "Login user",
    summary: "Login user",
    description: "Login user",
    tags: ["auth"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: LoginSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Get user by id",
        content: { "application/json": { schema: z.object({ token: z.string().jwt() }) } },
      },
      404: {
        description: "Get user by slug not found",
      },
    },
  }),
  async (c) => {
    const loginUser = c.req.valid("json");

    // Get user by username
    const user = await prismaClient.user.findUnique({
      where: {
        username: loginUser.username,
      },
      include: {
        password: true,
      },
    });

    if (!user) {
      return c.json({ message: "User not found" });
    }

    // Verify password
    if (user?.password?.hash) {
      const isPasswordCorrect = await verifyPassword(loginUser.password, user?.password?.hash);

      if (!isPasswordCorrect) {
        return c.json({ message: "Password is incorrect" }, 400);
      }
    }

    // Generate JWT
    const payload = {
      sub: user.id,
    };
    const secret = String(process.env.TOKEN_SECRET_KEY);
    const token = await sign(payload, secret);

    return c.json({ token: token }, 200);
  }
);

authRoutes.openapi(
  createRoute({
    method: "get",
    path: "/me",
    operationId: "Me",
    summary: "Me",
    description: "Me",
    tags: ["auth"],
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
        content: { "application/json": { schema: UserSchema } },
        description: "Get user info",
      },
      401: {
        description: "Unauthorized - Invalid or missing token",
      },
    },
  }),
  async (c) => {
    const user = c.get("user");
    return c.json(user);
  }
);
