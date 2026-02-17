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
      usuarioId: parseInt(usuarioId),
      titulo,
      mensaje,
      tipo,
      link: tareaId ? `/tareas?task=${tareaId}` : '/tareas',
      tareaId
    }
  })
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
    const misTareas = searchParams.get('misTareas')

    const where = { activo: true }

    if (estado) where.estado = estado
    if (prioridad) where.prioridad = prioridad
    if (misTareas === 'true') where.asignadoAId = user.id

    const tareas = await prisma.tarea.findMany({
      where,
      include: {
        creadoPor: { select: { id: true, nombre: true, apellido: true } },
        asignadoA: { select: { id: true, nombre: true, apellido: true } },
      },
      orderBy: [
        { prioridad: 'desc' },
        { createdAt: 'desc' }
      ],
    })

    const now = new Date()
    const overdueTasks = tareas.filter(t => {
      if (t.fechaLimite && t.estado !== 'Completada' && t.estado !== 'Cancelada') {
        const limite = new Date(t.fechaLimite)
        return now > limite
      }
      return false
    })

    return NextResponse.json({ tareas, overdueCount: overdueTasks.length })
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

    if (!data.titulo) {
      return NextResponse.json({ error: 'El título es requerido' }, { status: 400 })
    }

    const tarea = await prisma.tarea.create({
      data: {
        titulo: data.titulo,
        descripcion: data.descripcion || null,
        prioridad: data.prioridad || 'Media',
        estado: 'Pendiente',
        creadoPorId: user.id,
        asignadoAId: data.asignadoAId ? parseInt(data.asignadoAId) : null,
        fechaLimite: data.fechaLimite ? new Date(data.fechaLimite) : null,
      },
      include: {
        creadoPor: { select: { id: true, nombre: true, apellido: true } },
        asignadoA: { select: { id: true, nombre: true, apellido: true } },
      }
    })

    if (data.asignadoAId) {
      await createNotificacion(
        parseInt(data.asignadoAId),
        'Nueva tarea asignada',
        `Se te ha asignado la tarea: ${data.titulo}`,
        'Tarea',
        tarea.id
      )
    }

    return NextResponse.json(tarea)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
