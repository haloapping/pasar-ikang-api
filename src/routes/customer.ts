import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prismaClient } from "../../prisma/client";
import { CreateCustomerSchema, CustomerSchema, UpdateCustomerSchema } from "../types/customer";

export const customerRoutes = new OpenAPIHono();

customerRoutes.openapi(
  createRoute({
    method: "get",
    path: "/",
    operationId: "Get all customers",
    summary: "Get all customers",
    description: "Get all customers",
    tags: ["customers"],
    responses: {
      200: {
        description: "Get all customers",
        content: { "application/json": { schema: z.object({ data: z.array(CustomerSchema) }) } },
      },
    },
  }),
  async (c) => {
    const customers = await prismaClient.customer.findMany();

    return c.json({ data: customers }, 200);
  }
);

customerRoutes.openapi(
  createRoute({
    method: "get",
    path: "/:id",
    operationId: "Get customer by id",
    summary: "Get customer by id",
    description: "Get customer by id",
    tags: ["customers"],
    request: { params: z.object({ id: z.string() }) },
    responses: {
      200: {
        description: "Get customer by id",
        content: { "application/json": { schema: z.object({ data: z.array(CustomerSchema) }) } },
      },
      404: {
        description: "Get customer by slug not found",
      },
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const customer = await prismaClient.customer.findFirstOrThrow({
      where: { id },
    });

    if (!customer) {
      return c.json({ message: "Customer not found" }, 404);
    }

    return c.json({ data: customer }, 200);
  }
);

customerRoutes.openapi(
  createRoute({
    method: "post",
    path: "/",
    operationId: "Add new customer",
    summary: "Add new customer",
    description: "Add new customer",
    tags: ["customers"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateCustomerSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Add new customer",
        content: { "application/json": { schema: z.object({ data: CustomerSchema }) } },
      },
    },
  }),
  async (c) => {
    const newCustomerJSON = c.req.valid("json");
    const newCustomer = await prismaClient.customer.create({
      data: {
        ...newCustomerJSON,
      },
    });

    console.log(newCustomer);

    return c.json({ data: newCustomer }, 200);
  }
);

customerRoutes.openapi(
  createRoute({
    method: "patch",
    path: "/:id",
    operationId: "Update customer by id",
    summary: "Update customer by id",
    description: "Update customer by id",
    tags: ["customers"],
    request: {
      params: z.object({ id: z.string().ulid() }),
      body: {
        content: {
          "application/json": {
            schema: UpdateCustomerSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Update customer by id",
        content: { "application/json": { schema: z.object({ data: CustomerSchema }) } },
      },
    },
  }),
  async (c) => {
    try {
      const id = c.req.param("id");
      const updateCustomerJSON = await c.req.json();
      const updatedCustomer = await prismaClient.customer.update({
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

customerRoutes.openapi(
  createRoute({
    method: "delete",
    path: "/:id",
    operationId: "Delete customer by id",
    summary: "Delete customer by id",
    description: "Delete customer by id",
    tags: ["customers"],
    request: { params: z.object({ id: z.string().ulid() }) },
    responses: {
      200: {
        description: "Delete customer by id",
        content: { "application/json": { schema: z.object({ data: CustomerSchema }) } },
      },
      404: {
        description: "Delete customer by id not found",
      },
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const customer = await prismaClient.customer.delete({
      where: { id },
    });

    if (!customer) {
      return c.json({ message: "customer not found" }, 404);
    }

    return c.json({ data: customer }, 200);
  }
);
