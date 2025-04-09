import { PrismaClient } from "@prisma/client";
import { createNewSlug } from "../src/utils/slug";
import { fakeProducts } from "./fake-data/fake-product";

export const prismaClient = new PrismaClient();

async function seedProducts() {
  for (const fakeProduct of fakeProducts) {
    let product = await prismaClient.product.upsert({
      where: {
        name: fakeProduct.name,
      },
      update: fakeProduct,
      create: {
        ...fakeProduct,
        slug: createNewSlug(fakeProduct.name),
      },
    });
    console.log(product.name);
  }

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
