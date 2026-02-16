const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  try {
    await prisma.ticket.delete({ where: { id: 3 } })
    console.log('Deleted')
  } catch (e) {
    console.log('Error:', e.message)
  }
  await prisma.$disconnect()
}

test()
