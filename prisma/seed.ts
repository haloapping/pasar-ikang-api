import { fakerID_ID as faker } from "@faker-js/faker";
import { Customer } from "../src/types/customer";
import { prismaClient } from "./client";
import { random, sample } from "underscore";
import { CustomerContact } from "../src/types/customer-contact";

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

type customerIdxs = {
  id: string;
}[];

async function generateFakeCustomerContact(nData: number, customerIdxs: customerIdxs) {
  let customerContacts: CustomerContact[] = [];
  for (let i = 0; i < nData; i++) {
    const customerContact: CustomerContact = {
      customerId: customerIdxs[i].id,
      phoneNumber: faker.phone.number(),
      city: faker.location.city(),
      state: faker.location.state(),
      postalCode: faker.location.zipCode(),
      country: faker.location.country(),
      detail: faker.location.streetAddress(),
    };
    customerContacts.push(customerContact);
  }

  await prismaClient.customerContact.createManyAndReturn({
    data: customerContacts,
  });
}

async function main() {
  const customerIdxs = await generateFakeCustomer(20);
  await generateFakeCustomerContact(20, customerIdxs);
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
