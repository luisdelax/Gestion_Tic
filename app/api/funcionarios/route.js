import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

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

    const { searchParams } = new URL(request.url)
    const activo = searchParams.get('activo')
    const tipo = searchParams.get('tipo')

    const where = {}
    if (activo !== null) where.activo = activo === 'true'
    if (tipo) where.tipo = tipo

    const funcionarios = await prisma.funcionario.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(funcionarios)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()

    const existing = await prisma.funcionario.findFirst({
      where: {
        OR: [
          { cedula: data.cedula },
          { emailInstitucional: data.emailInstitucional },
        ],
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Cédula o email institucional ya registrado' },
        { status: 400 }
      )
    }

    const funcionario = await prisma.funcionario.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        tipo: data.tipo,
        cedula: data.cedula,
        telefono: data.telefono,
        emailPersonal: data.emailPersonal,
        emailInstitucional: data.emailInstitucional,
        dependencia: data.dependencia,
        cargo: data.cargo,
      },
    })

    return NextResponse.json(funcionario)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
