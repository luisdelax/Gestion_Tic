const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Try common passwords
  const commonPasswords = ['admin', 'Admin123', 'Admin123*', 'password', '123456', 'Admin123!', 'admin123']
  
  for (const pwd of commonPasswords) {
    const hash = await bcrypt.hash(pwd, 10)
    const result = await prisma.user.update({
      where: { email: 'admin@dinamiz.com' },
      data: { password: hash }
    })
    console.log(`Set password to: ${pwd}`)
    break
  }
  
  await prisma.$disconnect()
}

main().catch(console.error)
