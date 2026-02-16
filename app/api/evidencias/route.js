import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { writeFile, mkdir } from 'fs/promises'
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

    jwt.verify(token, process.env.JWT_SECRET)
    
    const formData = await request.formData()
    const file = formData.get('file')
    const ticketId = formData.get('ticketId')

    if (!file || !ticketId) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    const ext = file.name.split('.').pop().toLowerCase()
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf']
    
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido. Solo se aceptan JPG, JPEG, PNG y PDF' }, { status: 400 })
    }

    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no válido' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public', 'evidencias')
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const fileName = `${ticketId}_${Date.now()}.${ext}`
    const filePath = path.join(uploadDir, fileName)

    await writeFile(filePath, buffer)

    const evidencia = await prisma.evidencia.create({
      data: {
        ticketId: parseInt(ticketId),
        tipoArchivo: ext === 'pdf' ? 'pdf' : 'imagen',
        urlArchivo: `/evidencias/${fileName}`,
        nombreArchivo: file.name,
      },
    })

    return NextResponse.json(evidencia)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 })
  }
}
