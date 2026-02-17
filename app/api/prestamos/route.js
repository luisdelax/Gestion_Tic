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

    const where = {}
    if (estado) where.estado = estado

    const prestamos = await prisma.prestamo.findMany({
      where,
      include: {
        usuario: { select: { id: true, nombre: true, apellido: true } },
        equipoComputo: true,
        periferico: true,
        audiovisual: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(prestamos)
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

    if (!data.usuarioId) {
      return NextResponse.json(
        { error: 'Debe seleccionar un funcionario' },
        { status: 400 }
      )
    }

    if (!data.equipoComputoId && !data.perifericoId && !data.audiovisualId) {
      return NextResponse.json(
        { error: 'Debe seleccionar al menos un equipo' },
        { status: 400 }
      )
    }

    const prestamo = await prisma.prestamo.create({
      data: {
        usuarioId: data.usuarioId,
        equipoComputoId: data.equipoComputoId || null,
        perifericoId: data.perifericoId || null,
        audiovisualId: data.audiovisualId || null,
        fechaPrestamo: new Date(data.fechaPrestamo),
        fechaDevolucion: data.fechaDevolucion ? new Date(data.fechaDevolucion) : null,
        observaciones: data.observaciones,
        bolso: data.bolso || false,
        cargador: data.cargador || false,
        memoriaSd: data.memoriaSd || false,
        guaya: data.guaya || false,
        padMouse: data.padMouse || false,
        mouse: data.mouse || false,
      },
    })

    if (data.equipoComputoId) {
      await prisma.equipoComputo.update({
        where: { id: data.equipoComputoId },
        data: { estado: 'Prestado' }
      })
    }
    if (data.perifericoId) {
      await prisma.periferico.update({
        where: { id: data.perifericoId },
        data: { estado: 'Prestado' }
      })
    }
    if (data.audiovisualId) {
      await prisma.equipoAudiovisual.update({
        where: { id: data.audiovisualId },
        data: { estado: 'Prestado' }
      })
    }

    return NextResponse.json(prestamo)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
