import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const data = await request.json()
    const { usuarioId, titulo, mensaje, tipo, link } = data

    if (!titulo || !mensaje || !tipo) {
      return NextResponse.json({ error: 'Datos requeridos' }, { status: 400 })
    }

    const notificacion = await prisma.notificacion.create({
      data: {
        usuarioId,
        titulo,
        mensaje,
        tipo,
        link
      }
    })

    return NextResponse.json(notificacion)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
