import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Eliminando todas las incidencias...');
  
  const result = await prisma.incidencia.deleteMany({});
  
  console.log(`Eliminadas ${result.count} incidencias`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
