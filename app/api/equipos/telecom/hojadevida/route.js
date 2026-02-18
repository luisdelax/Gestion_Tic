import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'

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

export async function POST(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const equipoId = formData.get('equipoId')

    if (!file || !equipoId) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const fileName = `telecom_${equipoId}_${Date.now()}.pdf`
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    
    await writeFile(join(uploadsDir, fileName), buffer)

    const existing = await prisma.equipoTelecom.findUnique({
      where: { id: parseInt(equipoId) }
    })

    if (existing?.hojaVidaUrl) {
      const oldFile = existing.hojaVidaUrl.split('/uploads/')[1]
      try {
        await unlink(join(uploadsDir, oldFile))
      } catch (e) {}
    }

    const updated = await prisma.equipoTelecom.update({
      where: { id: parseInt(equipoId) },
      data: { hojaVidaUrl: `/uploads/${fileName}` }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const equipoId = searchParams.get('equipoId')

    const equipo = await prisma.equipoTelecom.findUnique({
      where: { id: parseInt(equipoId) }
    })

    if (!equipo?.hojaVidaUrl) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 })
    }

    const fileName = equipo.hojaVidaUrl.split('/uploads/')[1]
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    
    try {
      await unlink(join(uploadsDir, fileName))
    } catch (e) {}

    await prisma.equipoTelecom.update({
      where: { id: parseInt(equipoId) },
      data: { hojaVidaUrl: null }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
