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

    const equipo = await prisma.equipoAudiovisual.findUnique({
      where: { id: parseInt(params.id) },
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
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await request.json()

    if (data.placa) {
      const existingPlaca = await prisma.equipoAudiovisual.findFirst({
        where: { 
          placa: data.placa,
          NOT: { id: parseInt(params.id) }
        },
      })
      if (existingPlaca) {
        return NextResponse.json(
          { error: 'Placa ya registrada en otro equipo' },
          { status: 400 }
        )
      }
    }

    const equipo = await prisma.equipoAudiovisual.update({
      where: { id: parseInt(params.id) },
      data: {
        tipo: data.tipo,
        marca: data.marca,
        modelo: data.modelo,
        serial: data.serial,
        placa: data.placa || null,
        estado: data.estado,
        ubicacion: data.ubicacion,
        dependencia: data.dependencia,
        observaciones: data.observaciones,
      },
    })

    return NextResponse.json(equipo)
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

    await prisma.equipoAudiovisual.delete({
      where: { id: parseInt(params.id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
