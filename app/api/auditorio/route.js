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
    const fecha = searchParams.get('fecha')
    const estado = searchParams.get('estado')

    const where = {}
    if (estado) where.estado = estado
    if (fecha) {
      const fechaInicio = new Date(fecha)
      const fechaFin = new Date(fecha)
      fechaFin.setDate(fechaFin.getDate() + 1)
      where.fechaInicio = {
        gte: fechaInicio,
        lt: fechaFin,
      }
    }

    const reservas = await prisma.reservaAuditorio.findMany({
      where,
      orderBy: { fechaInicio: 'asc' },
    })

    return NextResponse.json(reservas)
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

    const conflictingReserva = await prisma.reservaAuditorio.findFirst({
      where: {
        activo: true,
        OR: [
          {
            fechaInicio: { lte: new Date(data.fechaInicio) },
            fechaFin: { gte: new Date(data.fechaInicio) },
          },
          {
            fechaInicio: { lte: new Date(data.fechaFin) },
            fechaFin: { gte: new Date(data.fechaFin) },
          },
          {
            fechaInicio: { gte: new Date(data.fechaInicio) },
            fechaFin: { lte: new Date(data.fechaFin) },
          },
        ],
      },
    })

    if (conflictingReserva) {
      return NextResponse.json(
        { error: 'Ya existe una reserva en ese horario' },
        { status: 400 }
      )
    }

    const reserva = await prisma.reservaAuditorio.create({
      data: {
        evento: data.evento,
        solicitante: data.solicitante,
        dependencia: data.dependencia,
        fechaInicio: new Date(data.fechaInicio),
        fechaFin: new Date(data.fechaFin),
        estado: data.estado || 'Pendiente',
        observaciones: data.observaciones,
      },
    })

    return NextResponse.json(reserva)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
