import * as Sentry from "@sentry/bun";
import { Hono } from "hono";
import { customerRoutes } from "./routes/customer";

const app = new Hono();

app.route("/customers", customerRoutes);

Sentry.init({
  dsn: process.env.DSN,
});

try {
  throw new Error("Pasar Ikang API started...");
} catch (e) {
  Sentry.captureException(e);
}

export default app;
