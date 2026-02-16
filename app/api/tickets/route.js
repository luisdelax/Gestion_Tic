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
    const prioridad = searchParams.get('prioridad')

    const where = {}
    if (estado) where.estado = estado
    if (prioridad) where.prioridad = prioridad

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        creadoPor: { select: { id: true, nombre: true, apellido: true } },
        asignadoA: { select: { id: true, nombre: true, apellido: true } },
        ubicacion: true,
        equipoComputo: true,
        evidencias: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tickets)
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

    const ticket = await prisma.ticket.create({
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion,
        estado: data.estado || 'Abierto',
        prioridad: data.prioridad || 'Media',
        creadoPorId: user.id,
        ubicacionId: data.ubicacionId || null,
        asignadoAId: data.asignadoAId || null,
        equipoId: data.equipoId || null,
        observaciones: data.observaciones,
      },
    })

    if (data.asignadoAId) {
      await prisma.notificacion.create({
        data: {
          usuarioId: data.asignadoAId,
          titulo: 'Nuevo ticket asignado',
          mensaje: `Se te ha asignado el ticket: ${ticket.titulo}`,
          tipo: 'Ticket',
          link: '/tickets'
        }
      })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
