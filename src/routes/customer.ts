import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { prismaClient } from "../../prisma/client";
import { type Customer, CustomerSchema } from "../types/customer";

export const customerRoutes = new Hono();

customerRoutes.get("/", async (c) => {
  try {
    const result = await prismaClient.customer.findMany();

    return c.json({ count: result.length, data: result });
  } catch (error) {
    return c.json({ error: error });
  }
});

customerRoutes.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const result = await prismaClient.customer.findFirstOrThrow({
      where: {
        id: id,
      },
    });

    if (!result) {
      return c.json({ message: "Customer not found", data: result });
    }

    return c.json({ message: "Customer found", data: result });
  } catch (error) {
    return c.json({ error: error });
  }
});

customerRoutes.post("/", zValidator("json", CustomerSchema), async (c) => {
  try {
    const customerJSON: Customer = await c.req.json();
    const result = await prismaClient.customer.create({
      data: {
        ...customerJSON,
      },
    });

    return c.json({ message: "Customer is added", data: result });
  } catch (error) {
    return c.json({ error: error });
  }
});

customerRoutes.patch("/:id", zValidator("json", CustomerSchema), async (c) => {
  try {
    const id = c.req.param("id");
    const customerJSON: Customer = await c.req.json();
    const result = await prismaClient.customer.update({
      data: {
        ...customerJSON,
      },
      where: {
        id: id,
      },
    });

    return c.json({ message: "Customer is updated", data: result });
  } catch (error) {}
});

customerRoutes.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const result = await prismaClient.customer.delete({
      where: {
        id: id,
      },
    });

    return c.json({ message: "Customer is deleted", data: result });
  } catch (error) {
    return c.json({ error: error });
  }
});
