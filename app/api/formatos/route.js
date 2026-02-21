import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const data = await request.json()
    
    const hojaVida = await prisma.hojaVidaEquipos.create({
      data: {
        responsable: data.responsable || '',
        area: data.area || '',
        inventario: data.inventario || '',
        marca: data.marca || '',
        modelo: data.modelo || '',
        serialCpu: data.serialCpu || '',
        cpu: data.cpu || '',
        procesador: data.procesador || '',
        velocidad: data.velocidad || '',
        memoriaRam: data.memoriaRam || '',
        discoDuro: data.discoDuro || '',
        tipoEquipo: data.tipoEquipo || '',
        nombreEquipo: data.nombreEquipo || '',
        enRed: data.enRed || '',
        direccionIp: data.direccionIp || '',
        mac: data.mac || '',
        sistemaOperativo: data.sistemaOperativo || '',
        monitorMarca: data.monitorMarca || '',
        monitorSerial: data.monitorSerial || '',
        monitorPlaca: data.monitorPlaca || '',
        tecladoMarca: data.tecladoMarca || '',
        tecladoSerial: data.tecladoSerial || '',
        tecladoPlaca: data.tecladoPlaca || '',
        mouseMarca: data.mouseMarca || '',
        mouseSerial: data.mouseSerial || '',
        mousePlaca: data.mousePlaca || '',
      }
    })
    
    return NextResponse.json(hojaVida)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const data = await request.json()
    
    if (!data.id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }
    
    const hojaVida = await prisma.hojaVidaEquipos.update({
      where: { id: data.id },
      data: {
        responsable: data.responsable || '',
        area: data.area || '',
        inventario: data.inventario || '',
        marca: data.marca || '',
        modelo: data.modelo || '',
        serialCpu: data.serialCpu || '',
        cpu: data.cpu || '',
        procesador: data.procesador || '',
        velocidad: data.velocidad || '',
        memoriaRam: data.memoriaRam || '',
        discoDuro: data.discoDuro || '',
        tipoEquipo: data.tipoEquipo || '',
        nombreEquipo: data.nombreEquipo || '',
        enRed: data.enRed || '',
        direccionIp: data.direccionIp || '',
        mac: data.mac || '',
        sistemaOperativo: data.sistemaOperativo || '',
        monitorMarca: data.monitorMarca || '',
        monitorSerial: data.monitorSerial || '',
        monitorPlaca: data.monitorPlaca || '',
        tecladoMarca: data.tecladoMarca || '',
        tecladoSerial: data.tecladoSerial || '',
        tecladoPlaca: data.tecladoPlaca || '',
        mouseMarca: data.mouseMarca || '',
        mouseSerial: data.mouseSerial || '',
        mousePlaca: data.mousePlaca || '',
      }
    })
    
    return NextResponse.json(hojaVida)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }
    
    await prisma.hojaVidaEquipos.delete({
      where: { id: parseInt(id) }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format')
    
    const hojasVida = await prisma.hojaVidaEquipos.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    if (format === 'json') {
      return NextResponse.json(hojasVida)
    }
    
    return NextResponse.json(hojasVida)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 })
  }
}
