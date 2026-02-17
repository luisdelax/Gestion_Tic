import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const now = new Date()
    
    const tareasVencidas = await prisma.tarea.findMany({
      where: {
        activo: true,
        estado: { in: ['Pendiente', 'EnProceso'] },
        NOT: { notificacionEnviada: true },
        fechaLimite: { lt: now }
      },
      include: {
        asignadoA: { select: { id: true, nombre: true } }
      }
    })

    let count = 0
    for (const tarea of tareasVencidas) {
      if (tarea.asignadoA) {
        await prisma.notificacion.create({
          data: {
            usuarioId: tarea.asignadoA.id,
            titulo: '⚠️ Tarea vencida',
            mensaje: `La tarea "${tarea.titulo}" ha superado su fecha límite`,
            tipo: 'Tarea',
            link: `/tareas?task=${tarea.id}`,
            tareaId: tarea.id
          }
        })
      }
      
      await prisma.tarea.update({
        where: { id: tarea.id },
        data: { notificacionEnviada: true }
      })
      
      count++
    }

    return NextResponse.json({ checked: true, notificationsSent: count })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
