import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

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

    const notificaciones = await prisma.notificacion.findMany({
      where: { usuarioId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    const sinLeer = await prisma.notificacion.count({
      where: { usuarioId: user.id, leida: false }
    })

    return NextResponse.json({ notificaciones, sinLeer })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id, todas } = await request.json()

    if (todas) {
      await prisma.notificacion.updateMany({
        where: { usuarioId: user.id, leida: false },
        data: { leida: true }
      })
    } else if (id) {
      await prisma.notificacion.update({
        where: { id },
        data: { leida: true }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
