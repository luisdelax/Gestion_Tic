const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = 'Admin123!'; // La contraseña que quieres usar
  const hash = bcrypt.hashSync(password, 10);

  console.log('Hash generado:', hash);

  // Crear o actualizar usuario admin
  const user = await prisma.user.upsert({
    where: { email: 'admin@dinamiz.com' },
    update: {
      password: hash,
      rol: 'Administrador',
      activo: true
    },
    create: {
      nombre: 'ADMIN',
      apellido: 'ISTRADOR',
      email: 'admin@dinamiz.com',
      password: hash,
      rol: 'Administrador',
      activo: true
    }
  });

  console.log('Usuario creado/actualizado:', user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
