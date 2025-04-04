import { PrismaClient } from "@prisma/client";
import { fakeProducts } from "./fake-data/fake-product";
import slugify from "slugify";

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
        slug: slugify(fakeProduct.name),
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
