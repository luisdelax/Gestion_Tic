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
    const estado = searchParams.get('estado')
    const tipo = searchParams.get('tipo')

    const where = {}
    if (estado) where.estado = estado
    if (tipo) where.tipo = tipo

    const perifericos = await prisma.periferico.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(perifericos)
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

    if (data.serial) {
      const existing = await prisma.periferico.findUnique({
        where: { serial: data.serial },
      })
      if (existing) {
        return NextResponse.json(
          { error: 'Serial ya registrado' },
          { status: 400 }
        )
      }
    }

    const periferico = await prisma.periferico.create({
      data: {
        tipo: data.tipo,
        marca: data.marca,
        modelo: data.modelo,
        serial: data.serial || null,
        color: data.color || null,
        estado: data.estado || 'Disponible',
        ubicacion: data.ubicacion,
        dependencia: data.dependencia,
        fechaAdquisicion: data.fechaAdquisicion ? new Date(data.fechaAdquisicion) : null,
        observaciones: data.observaciones,
      },
    })

    return NextResponse.json(periferico)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
