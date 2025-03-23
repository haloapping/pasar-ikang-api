import { fakerID_ID as faker } from "@faker-js/faker";
import { Customer } from "../src/types/customer";
import { prismaClient } from "./client";
import { fakeProducts } from "./fake-data/fake-product";

async function generateFakeCustomer(nData: number) {
  let setUsernames = new Set();
  let fakeUsernames = [];
  let counter = 1;
  do {
    let fakeUsername = faker.person.middleName().toLowerCase();
    if (!setUsernames.has(fakeUsername)) {
      setUsernames.add(fakeUsername);
      fakeUsernames.push(fakeUsername);
      counter++;
    }
  } while (counter <= nData);

  let customers = [];
  for (let i = 0; i < nData; i++) {
    let customer: Customer = {
      username: fakeUsernames[i],
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      avatarUrl: faker.internet.url(),
    };
    customers.push(customer);
  }

  const customerIdxs = await prismaClient.customer.createManyAndReturn({
    data: customers,
    select: { id: true },
  });

  return customerIdxs;
}

async function generateFakeProduct() {
  const products = await prismaClient.product.createManyAndReturn({
    data: fakeProducts,
  });
}

async function main() {
  const customerIdxs = await generateFakeCustomer(20);
  await generateFakeProduct();
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
