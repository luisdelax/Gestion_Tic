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

export async function GET(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        creadoPor: { select: { id: true, nombre: true, apellido: true, email: true } },
        asignadoA: { select: { id: true, nombre: true, apellido: true, email: true } },
        equipoComputo: true,
        evidencias: true,
      },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()

    const oldTicket = await prisma.ticket.findUnique({
      where: { id: parseInt(params.id) }
    })

    const updateData = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      estado: data.estado,
      prioridad: data.prioridad,
      observaciones: data.observaciones,
    }

    if (data.asignadoAId !== undefined) {
      updateData.asignadoAId = data.asignadoAId || null
    }

    if (data.estado === 'Cerrado' || data.estado === 'Resuelto') {
      updateData.fechaCierre = new Date()
    }

    const ticket = await prisma.ticket.update({
      where: { id: parseInt(params.id) },
      data: updateData,
    })

    if (oldTicket) {
      if (data.asignadoAId && data.asignadoAId !== oldTicket.asignadoAId) {
        await prisma.notificacion.create({
          data: {
            usuarioId: data.asignadoAId,
            titulo: 'Ticket asignado',
            mensaje: `Se te ha asignado el ticket: ${ticket.titulo}`,
            tipo: 'Ticket',
            link: '/tickets'
          }
        })
      }

      if ((data.estado === 'Cerrado' || data.estado === 'Resuelto') && oldTicket.estado !== data.estado) {
        await prisma.notificacion.create({
          data: {
            usuarioId: oldTicket.creadoPorId,
            titulo: `Ticket ${data.estado === 'Cerrado' ? 'cerrado' : 'resuelto'}`,
            mensaje: `Tu ticket "${ticket.titulo}" ha sido marcado como ${data.estado === 'Cerrado' ? 'cerrado' : 'resuelto'}`,
            tipo: 'Ticket',
            link: '/tickets'
          }
        })
      }
    }

    return NextResponse.json(ticket)
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.rol !== 'Administrador') {
      return NextResponse.json({ error: 'Solo administradores pueden eliminar' }, { status: 403 })
    }

    await prisma.ticket.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
