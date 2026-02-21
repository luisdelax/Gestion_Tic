import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas'

export async function generarHojaVidaPDF(data, elementId = null) {
  if (elementId) {
    const element = document.getElementById(elementId)
    if (element) {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      const doc = new jsPDF('p', 'mm', 'a4')
      let heightLeft = imgHeight
      let position = 0
      
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        doc.addPage()
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      const fileName = `HojaVida_${data.inventario || 'EQUIPO'}_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)
      return fileName
    }
  }
  
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  
  const margin = 10
  let y = 10
  const cellHeight = 5
  
  const cellBorder = { color: [0, 0, 0], lineWidth: 0.1 }
  
  const drawCell = (x, y, w, h, text, bold = false, bg = null) => {
    doc.setDrawColor(0)
    doc.setLineWidth(0.1)
    doc.rect(x, y, w, h)
    if (bg) {
      doc.setFillColor(bg[0], bg[1], bg[2])
      doc.rect(x, y, w, h, 'F')
    }
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setFontSize(9)
    doc.text(String(text || ''), x + 1, y + h/1.5)
  }
  
  drawCell(margin, y, 40, cellHeight, 'Responsable', true, [217, 217, 217])
  drawCell(margin + 40, y, 50, cellHeight, data.responsable || '')
  drawCell(margin + 90, y, 30, cellHeight, 'Área', true, [217, 217, 217])
  drawCell(margin + 120, y, 70, cellHeight, data.area || '')
  
  y += cellHeight
  drawCell(margin, y, 190, cellHeight, 'DATOS DEL EQUIPO', true, [217, 217, 217])
  
  y += cellHeight
  drawCell(margin, y, 35, cellHeight, 'Nº Inventario', true)
  drawCell(margin + 35, y, 70, cellHeight, data.inventario || '')
  drawCell(margin + 105, y, 40, cellHeight, 'Marca y/o Modelo Monitor', true)
  drawCell(margin + 145, y, 45, cellHeight, data.monitorMarca || '')
  
  y += cellHeight
  drawCell(margin, y, 35, cellHeight * 2, 'Marca', true)
  drawCell(margin + 35, y, 70, cellHeight * 2, data.marca || '')
  drawCell(margin + 105, y, 40, cellHeight, 'Serial Monitor', true)
  drawCell(margin + 145, y, 45, cellHeight, data.monitorSerial || '')
  
  y += cellHeight
  drawCell(margin + 105, y, 40, cellHeight, 'Placa Monitor', true)
  drawCell(margin + 145, y, 45, cellHeight, data.monitorPlaca || '')
  
  y += cellHeight
  drawCell(margin, y, 35, cellHeight, 'Modelo', true)
  drawCell(margin + 35, y, 70, cellHeight, data.modelo || '')
  drawCell(margin + 105, y, 40, cellHeight, 'Marca y/o Modelo Teclado', true)
  drawCell(margin + 145, y, 45, cellHeight, data.tecladoMarca || '')
  
  y += cellHeight
  drawCell(margin, y, 35, cellHeight * 2, 'Serial CPU', true)
  drawCell(margin + 35, y, 70, cellHeight * 2, data.serialCpu || '')
  drawCell(margin + 105, y, 40, cellHeight, 'Serial Teclado', true)
  drawCell(margin + 145, y, 45, cellHeight, data.tecladoSerial || '')
  
  y += cellHeight
  drawCell(margin + 105, y, 40, cellHeight, 'Placa Teclado', true)
  drawCell(margin + 145, y, 45, cellHeight, data.tecladoPlaca || '')
  
  y += cellHeight
  drawCell(margin, y, 30, cellHeight, 'Procesador', true)
  drawCell(margin + 30, y, 35, cellHeight, data.procesador || '')
  drawCell(margin + 65, y, 25, cellHeight, 'Velocidad', true)
  drawCell(margin + 90, y, 25, cellHeight, data.velocidad || '')
  drawCell(margin + 115, y, 35, cellHeight, 'Marca y/o Modelo Mouse', true)
  drawCell(margin + 150, y, 40, cellHeight, data.mouseMarca || '')
  
  y += cellHeight
  drawCell(margin, y, 35, cellHeight * 2, 'Memoria RAM', true)
  drawCell(margin + 35, y, 70, cellHeight * 2, data.memoriaRam || '')
  drawCell(margin + 105, y, 40, cellHeight, 'Serial Mouse', true)
  drawCell(margin + 145, y, 45, cellHeight, data.mouseSerial || '')
  
  y += cellHeight
  drawCell(margin + 105, y, 40, cellHeight, 'Placa Mouse', true)
  drawCell(margin + 145, y, 45, cellHeight, data.mousePlaca || '')
  
  y += cellHeight
  drawCell(margin, y, 35, cellHeight * 2, 'Disco Duro', true)
  drawCell(margin + 35, y, 35, cellHeight, 'Capacidad', true)
  drawCell(margin + 70, y, 35, cellHeight, 'Tipo', true)
  drawCell(margin + 105, y, 50, cellHeight, 'CPU', true)
  drawCell(margin + 155, y, 45, cellHeight, data.cpu || '')
  
  y += cellHeight
  drawCell(margin, y, 35, cellHeight, data.discoDuro || '')
  drawCell(margin + 35, y, 35, cellHeight, data.discoDuro || '')
  drawCell(margin + 70, y, 35, cellHeight, data.tipoEquipo === 'ALL IN ONE' ? 'ALL IN ONE' : '', false, data.tipoEquipo === 'ALL IN ONE' ? [255, 255, 0] : null)
  drawCell(margin + 105, y, 25, cellHeight, data.tipoEquipo === 'PORTATIL' ? 'PORTATIL' : '', false, data.tipoEquipo === 'PORTATIL' ? [255, 255, 0] : null)
  drawCell(margin + 130, y, 25, cellHeight, data.tipoEquipo === 'CPU' ? 'CPU' : '', false, data.tipoEquipo === 'CPU' ? [255, 255, 0] : null)
  drawCell(margin + 155, y, 45, cellHeight, data.cpu || '')
  
  y += cellHeight
  drawCell(margin, y, 190, cellHeight, 'CONFIGURACIÓN DE RED', true, [217, 217, 217])
  
  y += cellHeight
  drawCell(margin, y, 55, cellHeight, 'Nombre del Equipo', true)
  drawCell(margin + 55, y, 35, cellHeight, 'En red', true)
  drawCell(margin + 90, y, 35, cellHeight, 'Dirección IP', true)
  drawCell(margin + 125, y, 75, cellHeight, 'Mac', true)
  
  y += cellHeight
  drawCell(margin, y, 55, cellHeight, data.nombreEquipo || '')
  drawCell(margin + 55, y, 17, cellHeight, 'SI', false, data.enRed === 'SI' ? [255, 255, 0] : null)
  drawCell(margin + 72, y, 18, cellHeight, 'NO', false, data.enRed === 'NO' ? [255, 255, 0] : null)
  drawCell(margin + 90, y, 35, cellHeight, data.direccionIp || '')
  drawCell(margin + 125, y, 75, cellHeight, data.mac || '')
  
  y += cellHeight
  drawCell(margin, y, 190, cellHeight, 'SISTEMA OPERATIVO INSTALADO', true, [217, 217, 217])
  
  y += cellHeight
  drawCell(margin, y, 190, cellHeight * 2, data.sistemaOperativo || '')
  
  const fileName = `HojaVida_${data.inventario || 'EQUIPO'}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
  
  return fileName
}
