import { fakeProducts } from "./fake-data/fake-product";

import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient();

async function seedProducts() {
  await prismaClient.product.deleteMany();

  const products = await prismaClient.product.createManyAndReturn({
    data: fakeProducts,
  });

  console.log("Product seed is executed 🌱");
}

async function main() {
  await seedProducts();
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
