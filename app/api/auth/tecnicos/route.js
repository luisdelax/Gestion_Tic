import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

async function verifyAuth(request) {
  const token = request.cookies.get('token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

export async function GET(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const tecnicos = await prisma.user.findMany({
      where: {
        rol: 'TecnicoN1',
        activo: true,
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
      },
      orderBy: { nombre: 'asc' },
    })

    return NextResponse.json(tecnicos)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
