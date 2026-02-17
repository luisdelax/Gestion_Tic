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

async function createNotificacion(usuarioId, titulo, mensaje, tipo, tareaId = null) {
  await prisma.notificacion.create({
    data: {
      usuarioId,
      titulo,
      mensaje,
      tipo,
      link: tareaId ? `/tareas?task=${tareaId}` : '/tareas',
      tareaId
    }
  })
}

export async function GET(request, { params }) {
  const { id } = await params
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const tarea = await prisma.tarea.findUnique({
      where: { id: parseInt(id) },
      include: {
        creadoPor: { select: { id: true, nombre: true, apellido: true } },
        asignadoA: { select: { id: true, nombre: true, apellido: true } },
      },
    })

    if (!tarea) {
      return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 })
    }

    return NextResponse.json(tarea)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  const { id } = await params
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const tareaActual = await prisma.tarea.findUnique({
      where: { id: parseInt(id) }
    })

    if (!tareaActual) {
      return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 })
    }

    const updateData = {}
    if (data.titulo) updateData.titulo = data.titulo
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion
    if (data.prioridad) updateData.prioridad = data.prioridad
    if (data.estado) updateData.estado = data.estado
    if (data.asignadoAId !== undefined) {
      updateData.asignadoAId = data.asignadoAId ? parseInt(data.asignadoAId) : null
    }
    if (data.fechaLimite) {
      updateData.fechaLimite = new Date(data.fechaLimite)
    } else if (data.fechaLimite === null || data.fechaLimite === '') {
      updateData.fechaLimite = null
    }

    const tarea = await prisma.tarea.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        creadoPor: { select: { id: true, nombre: true, apellido: true } },
        asignadoA: { select: { id: true, nombre: true, apellido: true } },
      }
    })

    if (data.asignadoAId && data.asignadoAId !== tareaActual.asignadoAId) {
      await createNotificacion(
        data.asignadoAId,
        'Tarea asignada',
        `Se te ha asignado la tarea: ${tarea.titulo}`,
        'Tarea',
        tarea.id
      )
    }

    if (data.estado === 'Completada' && tareaActual.estado !== 'Completada') {
      if (tareaActual.creadoPorId !== user.id && tareaActual.creadoPorId) {
        await createNotificacion(
          tareaActual.creadoPorId,
          'Tarea completada',
          `La tarea "${tarea.titulo}" ha sido completada`,
          'Tarea',
          tarea.id
        )
      }
    }

    return NextResponse.json(tarea)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const tarea = await prisma.tarea.update({
      where: { id: parseInt(id) },
      data: { activo: false }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
