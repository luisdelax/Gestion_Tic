const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const password = 'Blackdrone+05'
  const hash = await bcrypt.hash(password, 10)
  
  await prisma.user.update({
    where: { email: 'luisedelacruzf@gmail.com' },
    data: { password: hash }
  })
  
  console.log('Password updated:', hash)
  await prisma.$disconnect()
}

main()
