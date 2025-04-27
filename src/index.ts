import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference as scalarHonoApiReference } from "@scalar/hono-api-reference";
import * as Sentry from "@sentry/bun";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { configDocs, configGeneral } from "./configs/app";
import { authRoutes } from "./routes/auth";
import { cartRoutes } from "./routes/cart";
import { productRoutes } from "./routes/product";
import { userRoutes } from "./routes/user";
import { jwt } from "hono/jwt";

const app = new OpenAPIHono();
app.use(cors());
app.use(logger());
app.use(
  "/auth/me",
  jwt({
    secret: String(process.env.TOKEN_SECRET_KEY),
  })
);

const apiRoutes = app.basePath("/");
apiRoutes.route("/auth", authRoutes);
apiRoutes.route("/users", userRoutes);
apiRoutes.route("/products", productRoutes);
apiRoutes.route("/cart", cartRoutes);

apiRoutes
  .doc(configDocs.openapi, {
    openapi: "3.1.0",
    info: { ...configGeneral, version: "v1" },
  })
  .get(
    "/",
    scalarHonoApiReference({
      pageTitle: "Pasar Ikang API",
      url: "/openapi.json",
    })
  )
  .onError((err, c) => {
    return c.json({ code: 400, status: "error", message: err.message }, 400);
  });

console.info("🐟️ Pasar Ikang Backend API");

export type ApiRoutes = typeof apiRoutes;

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

try {
  throw new Error("Pasar Ikang API started...");
} catch (e) {
  Sentry.captureException(e);
}

export default app;
