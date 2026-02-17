import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = jwt.verify(token, process.env.JWT_SECRET)
    
    const formData = await request.formData()
    const file = formData.get('file')
    const equipoId = formData.get('equipoId')

    if (!file || !equipoId) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const ext = file.name.split('.').pop().toLowerCase()
    
    if (ext !== 'pdf') {
      return NextResponse.json({ error: 'Solo se aceptan archivos PDF' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Tipo de archivo no válido' }, { status: 400 })
    }

    const existingEquipo = await prisma.equipoComputo.findUnique({
      where: { id: parseInt(equipoId) }
    })

    if (existingEquipo?.hojaVidaUrl) {
      const oldFilePath = path.join(process.cwd(), 'public', existingEquipo.hojaVidaUrl)
      if (existsSync(oldFilePath)) {
        await unlink(oldFilePath)
      }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public', 'hojas-vida')
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const fileName = `equipo_${equipoId}_${Date.now()}.pdf`
    const filePath = path.join(uploadDir, fileName)

    await writeFile(filePath, buffer)

    const url = `/hojas-vida/${fileName}`

    const equipo = await prisma.equipoComputo.update({
      where: { id: parseInt(equipoId) },
      data: { hojaVidaUrl: url }
    })

    return NextResponse.json({ success: true, url, equipo })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const user = jwt.verify(token, process.env.JWT_SECRET)
    
    const { searchParams } = new URL(request.url)
    const equipoId = searchParams.get('equipoId')

    if (!equipoId) {
      return NextResponse.json({ error: 'Falta ID del equipo' }, { status: 400 })
    }

    const existingEquipo = await prisma.equipoComputo.findUnique({
      where: { id: parseInt(equipoId) }
    })

    if (existingEquipo?.hojaVidaUrl) {
      const filePath = path.join(process.cwd(), 'public', existingEquipo.hojaVidaUrl)
      if (existsSync(filePath)) {
        await unlink(filePath)
      }
    }

    await prisma.equipoComputo.update({
      where: { id: parseInt(equipoId) },
      data: { hojaVidaUrl: null }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al eliminar archivo' }, { status: 500 })
  }
}
