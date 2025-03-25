import * as Sentry from "@sentry/bun";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { customerRoutes } from "./routes/customer";
import { productRoutes } from "./routes/product";

const app = new Hono();
app.use(logger());

app.get("/", (c) => {
  return c.json({ message: "Pasar Ikang API" });
});

app.route("/customers", customerRoutes);
app.route("/products", productRoutes);

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

try {
  throw new Error("Pasar Ikang API started...");
} catch (e) {
  Sentry.captureException(e);
}

export default app;
