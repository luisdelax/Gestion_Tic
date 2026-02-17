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
  const { id } = await params
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const prestamo = await prisma.prestamo.findUnique({
      where: { id: parseInt(id) },
      include: {
        usuario: { select: { id: true, nombre: true, apellido: true } },
        equipoComputo: true,
        periferico: true,
        audiovisual: true,
      },
    })

    if (!prestamo) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }

    return NextResponse.json(prestamo)
  } catch (error) {
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

    const prestamo = await prisma.prestamo.update({
      where: { id: parseInt(id) },
      data: {
        estado: data.estado,
        observaciones: data.observaciones,
        fechaDevolucion: data.estado === 'Devuelto' ? new Date() : undefined,
        bolso: data.bolso || false,
        cargador: data.cargador || false,
        memoriaSd: data.memoriaSd || false,
        guaya: data.guaya || false,
        padMouse: data.padMouse || false,
        mouse: data.mouse || false,
      },
    })

    return NextResponse.json(prestamo)
  } catch (error) {
    console.error('Error updating prestamo:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params
  try {
    const user = await verifyAuth(request)
    if (!user || user.rol !== 'Administrador') {
      return NextResponse.json({ error: 'Solo administradores pueden eliminar' }, { status: 403 })
    }

    await prisma.prestamo.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
