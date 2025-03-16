import { z } from "zod";

export const InvoiceSchema = z.object({
  id: z.string().ulid().optional(),
  orderId: z.string().ulid(),
  dueDate: z.date(),
  paymentStatus: z.enum(["Pending", "Paid", "Overdue", "Cancelled", "Refunded", "Failed"]),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Invoice = z.infer<typeof InvoiceSchema>;
