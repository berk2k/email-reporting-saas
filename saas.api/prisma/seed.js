import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const newUser = await prisma.user.create({
    data: {
      email: 'example@example.com',
      password: 'password',
    },
  });

  console.log('New user added:', newUser);
}

const salesData = [
  {
    item: 'Coffee',
    userId:1,
    quantity: 50,
    total: 100.0,
    paymentMethod: 'Cash',
  },
  {
    item: 'Espresso',
    quantity: 30,
    userId:2,
    total: 90.0,
    paymentMethod: 'Card',
  },
  {
    item: 'Sandwich',
    quantity: 20,
    userId:1,
    total: 60.0,
    paymentMethod: 'Cash',
  },
  {
    item: 'Latte',
    quantity: 40,
    userId:1,
    total: 120.0,
    paymentMethod: 'Card',
  },
];

// Add sales data to the database
for (const sale of salesData) {
  await prisma.Sales.create({
    data: sale,
  });
}

console.log('Sales data seeded!');


main()
.catch((e) => {
  console.error(e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
});
