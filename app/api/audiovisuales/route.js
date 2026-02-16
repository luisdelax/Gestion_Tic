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

    const equipos = await prisma.equipoAudiovisual.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(equipos)
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

    const existing = await prisma.equipoAudiovisual.findUnique({
      where: { serial: data.serial },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Serial ya registrado' },
        { status: 400 }
      )
    }

    if (data.placa) {
      const existingPlaca = await prisma.equipoAudiovisual.findUnique({
        where: { placa: data.placa },
      })
      if (existingPlaca) {
        return NextResponse.json(
          { error: 'Placa ya registrada' },
          { status: 400 }
        )
      }
    }

    const equipo = await prisma.equipoAudiovisual.create({
      data: {
        tipo: data.tipo,
        marca: data.marca,
        modelo: data.modelo,
        serial: data.serial,
        placa: data.placa || null,
        estado: data.estado || 'Disponible',
        ubicacion: data.ubicacion,
        dependencia: data.dependencia,
        fechaAdquisicion: data.fechaAdquisicion ? new Date(data.fechaAdquisicion) : null,
        observaciones: data.observaciones,
      },
    })

    return NextResponse.json(equipo)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
