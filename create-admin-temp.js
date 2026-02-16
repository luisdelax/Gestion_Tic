const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Admin123!', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@dinamiz.com' },
    update: { password: hash, rol: 'Administrador', activo: true },
    create: { nombre: 'Admin', apellido: 'Principal', email: 'admin@dinamiz.com', password: hash, rol: 'Administrador', activo: true }
  });
  console.log('Usuario creado:', user.email, '- Rol:', user.rol);
}
main().then(() => prisma.$disconnect()).catch(e => console.error(e));
