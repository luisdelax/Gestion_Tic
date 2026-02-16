import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { unlink } from 'fs/promises'
import path from 'path'

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

    const evidencia = await prisma.evidencia.findUnique({
      where: { id: parseInt(params.id) },
    })

    if (!evidencia) {
      return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
    }

    return NextResponse.json(evidencia)
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const evidencia = await prisma.evidencia.findUnique({
      where: { id: parseInt(params.id) },
    })

    if (evidencia) {
      const filePath = path.join(process.cwd(), 'public', evidencia.urlArchivo)
      try {
        await unlink(filePath)
      } catch (e) {
        console.error('Error deleting file:', e)
      }

      await prisma.evidencia.delete({
        where: { id: parseInt(params.id) },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
