import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import { prismaClient } from "../../prisma/client";
import { User } from "../types/user";

type Env = {
  Variables: {
    user: User;
  };
};

export const checkAuthorized = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    return c.json({ message: "Authorization header is required" }, 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return c.json({ message: "Token is requred" }, 401);
  }

  const payload: JWTPayload = await verify(token, String(process.env.TOKEN_SECRET_KEY));
  console.log(payload);
  if (!payload) {
    return c.json({ message: "Invalid token" }, 401);
  }

  const user = await prismaClient.user.findUnique({
    where: { id: String(payload.sub) },
  });
  if (!user) {
    return c.json({ message: "User is no longer available" }, 401);
  }

  c.set("user", user);

  await next();
});
