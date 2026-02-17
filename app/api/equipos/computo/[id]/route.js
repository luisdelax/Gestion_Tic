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

    const equipo = await prisma.equipoComputo.findUnique({
      where: { id: parseInt(id) },
      include: { responsable: true },
    })

    if (!equipo) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }

    return NextResponse.json(equipo)
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

    if (data.placa) {
      const existingPlaca = await prisma.equipoComputo.findFirst({
        where: { 
          placa: data.placa,
          NOT: { id: parseInt(id) }
        },
      })
      if (existingPlaca) {
        return NextResponse.json(
          { error: 'Placa ya registrada en otro equipo' },
          { status: 400 }
        )
      }
    }

    const equipo = await prisma.equipoComputo.update({
      where: { id: parseInt(id) },
      data: {
        tipo: data.tipo,
        marca: data.marca,
        modelo: data.modelo,
        mac: data.mac,
        placa: data.placa || null,
        procesador: data.procesador || null,
        ram: data.ram || null,
        unidadRam: data.unidadRam || null,
        discoDuro: data.discoDuro || null,
        unidadDisco: data.unidadDisco || null,
        estado: data.estado,
        ubicacion: data.ubicacion,
        dependencia: data.dependencia,
        observaciones: data.observaciones,
        responsableId: data.responsableId || null,
      },
    })

    return NextResponse.json(equipo)
  } catch (error) {
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

    const existing = await prisma.equipoComputo.findUnique({ where: { id: parseInt(id) } })
    if (!existing) {
      return NextResponse.json({ error: 'Equipo no encontrado' }, { status: 404 })
    }

    await prisma.equipoComputo.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
