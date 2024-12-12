import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.createMany({
    data: [
      { name: "Backend" },
      { name: "Database" },
      { name: "Frontend" },
      { name: "Math" },
      { name: "Music" },
      { name: "Security" },
      { name: "Sport" },
    ],
  });

  console.log("✅ seed.mjs => category:", category);
  console.log("✅ seeding the database categories was successful");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Error seeding the database categories", error);
    await prisma.$disconnect();
    process.exit(1);
  });
