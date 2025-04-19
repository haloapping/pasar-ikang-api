import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/password";
import { createNewSlug } from "../src/utils/slug";
import { fakeProducts } from "./fake-data/fake-product";
import { fakeUsers } from "./fake-data/fake-user";

export const prismaClient = new PrismaClient();

async function seedProducts() {
  for (const fakeProduct of fakeProducts) {
    let product = await prismaClient.product.upsert({
      where: {
        name: fakeProduct.name,
      },
      update: {
        ...fakeProduct,
        slug: createNewSlug(fakeProduct.name),
      },
      create: {
        ...fakeProduct,
        slug: createNewSlug(fakeProduct.name),
      },
    });
    console.log(product.name);
  }

  console.log("Product seed is executed 🌱\n");
}

async function seedUsers() {
  for (const fakeUser of fakeUsers) {
    let user = await prismaClient.user.upsert({
      where: {
        username: fakeUser.username,
      },
      update: {
        ...fakeUser,
        password: {
          create: {
            hash: await hashPassword(fakeUser.password),
          },
        },
      },
      create: {
        ...fakeUser,
        password: {
          create: {
            hash: await hashPassword(fakeUser.password),
          },
        },
      },
    });

    // create cart
    await prismaClient.cart.create({
      data: {
        userId: user.id,
      },
    });

    console.log(user.username);
  }

  console.log("User seed is executed 🌱\n");
}

async function main() {
  await seedUsers();
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
