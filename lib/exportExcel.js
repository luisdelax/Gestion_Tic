import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export async function generarHojaVidaExcel(data) {
  const workbook = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([])
  
  const cellBorder = { 
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } }
  }
  
  const baseStyle = { alignment: { horizontal: 'center' }, border: cellBorder }
  const boldStyle = { font: { bold: true }, alignment: { horizontal: 'center' }, border: cellBorder }
  const headerStyle = { font: { bold: true }, fill: { fgColor: { rgb: 'D9D9D9' } }, alignment: { horizontal: 'center' }, border: cellBorder }
  const yellowStyle = { font: { bold: true }, fill: { fgColor: { rgb: 'FFFF00' } }, alignment: { horizontal: 'center' }, border: cellBorder }
  
  const setCell = (row, col, value, style = baseStyle) => {
    const cellRef = XLSX.utils.encode_cell({ r: row, c: col })
    ws[cellRef] = { t: 's', v: value || '', s: style }
  }
  
  let r = 0
  setCell(r, 0, 'Responsable', headerStyle)
  setCell(r, 1, data.responsable || '', baseStyle)
  setCell(r, 2, data.responsable || '', baseStyle)
  setCell(r, 3, data.responsable || '', baseStyle)
  setCell(r, 4, data.responsable || '', baseStyle)
  setCell(r, 5, 'Área', headerStyle)
  setCell(r, 6, data.area || '', baseStyle)
  setCell(r, 7, data.area || '', baseStyle)
  setCell(r, 8, data.area || '', baseStyle)
  setCell(r, 9, data.area || '', baseStyle)
  
  r = 1
  setCell(r, 0, 'DATOS DEL EQUIPO', headerStyle)
  
  r = 2
  setCell(r, 0, 'Nº Inventario', boldStyle)
  setCell(r, 1, data.inventario || '', baseStyle)
  setCell(r, 2, data.inventario || '', baseStyle)
  setCell(r, 3, data.inventario || '', baseStyle)
  setCell(r, 4, data.inventario || '', baseStyle)
  setCell(r, 5, data.inventario || '', baseStyle)
  setCell(r, 6, 'Marca y/o Modelo Monitor', boldStyle)
  setCell(r, 7, data.monitorMarca || '', baseStyle)
  setCell(r, 8, data.monitorMarca || '', baseStyle)
  setCell(r, 9, data.monitorMarca || '', baseStyle)
  
  r = 3
  setCell(r, 0, 'Marca', boldStyle)
  setCell(r, 1, data.marca || '', baseStyle)
  setCell(r, 2, data.marca || '', baseStyle)
  setCell(r, 3, data.marca || '', baseStyle)
  setCell(r, 4, data.marca || '', baseStyle)
  setCell(r, 5, data.marca || '', baseStyle)
  setCell(r, 6, 'Serial Monitor', boldStyle)
  setCell(r, 7, data.monitorSerial || '', baseStyle)
  setCell(r, 8, data.monitorSerial || '', baseStyle)
  setCell(r, 9, data.monitorSerial || '', baseStyle)
  
  r = 4
  setCell(r, 6, 'Placa Monitor', boldStyle)
  setCell(r, 7, data.monitorPlaca || '', baseStyle)
  setCell(r, 8, data.monitorPlaca || '', baseStyle)
  setCell(r, 9, data.monitorPlaca || '', baseStyle)
  
  r = 5
  setCell(r, 0, 'Modelo', boldStyle)
  setCell(r, 1, data.modelo || '', baseStyle)
  setCell(r, 2, data.modelo || '', baseStyle)
  setCell(r, 3, data.modelo || '', baseStyle)
  setCell(r, 4, data.modelo || '', baseStyle)
  setCell(r, 5, data.modelo || '', baseStyle)
  setCell(r, 6, 'Marca y/o Modelo Teclado', boldStyle)
  setCell(r, 7, data.tecladoMarca || '', baseStyle)
  setCell(r, 8, data.tecladoMarca || '', baseStyle)
  setCell(r, 9, data.tecladoMarca || '', baseStyle)
  
  r = 6
  setCell(r, 0, 'Serial CPU', boldStyle)
  setCell(r, 1, data.serialCpu || '', baseStyle)
  setCell(r, 2, data.serialCpu || '', baseStyle)
  setCell(r, 3, data.serialCpu || '', baseStyle)
  setCell(r, 4, data.serialCpu || '', baseStyle)
  setCell(r, 5, data.serialCpu || '', baseStyle)
  setCell(r, 6, 'Serial Teclado', boldStyle)
  setCell(r, 7, data.tecladoSerial || '', baseStyle)
  setCell(r, 8, data.tecladoSerial || '', baseStyle)
  setCell(r, 9, data.tecladoSerial || '', baseStyle)
  
  r = 7
  setCell(r, 6, 'Placa Teclado', boldStyle)
  setCell(r, 7, data.tecladoPlaca || '', baseStyle)
  setCell(r, 8, data.tecladoPlaca || '', baseStyle)
  setCell(r, 9, data.tecladoPlaca || '', baseStyle)
  
  r = 8
  setCell(r, 0, 'Procesador', boldStyle)
  setCell(r, 1, data.procesador || '', baseStyle)
  setCell(r, 2, data.procesador || '', baseStyle)
  setCell(r, 3, data.procesador || '', baseStyle)
  setCell(r, 4, 'Velocidad', boldStyle)
  setCell(r, 5, data.velocidad || '', baseStyle)
  setCell(r, 6, 'Marca y/o Modelo Mouse', boldStyle)
  setCell(r, 7, data.mouseMarca || '', baseStyle)
  setCell(r, 8, data.mouseMarca || '', baseStyle)
  setCell(r, 9, data.mouseMarca || '', baseStyle)
  
  r = 9
  setCell(r, 0, 'Memoria RAM', boldStyle)
  setCell(r, 1, data.memoriaRam || '', baseStyle)
  setCell(r, 2, data.memoriaRam || '', baseStyle)
  setCell(r, 3, data.memoriaRam || '', baseStyle)
  setCell(r, 4, data.memoriaRam || '', baseStyle)
  setCell(r, 5, data.memoriaRam || '', baseStyle)
  setCell(r, 6, 'Serial Mouse', boldStyle)
  setCell(r, 7, data.mouseSerial || '', baseStyle)
  setCell(r, 8, data.mouseSerial || '', baseStyle)
  setCell(r, 9, data.mouseSerial || '', baseStyle)
  
  r = 10
  setCell(r, 6, 'Placa Mouse', boldStyle)
  setCell(r, 7, data.mousePlaca || '', baseStyle)
  setCell(r, 8, data.mousePlaca || '', baseStyle)
  setCell(r, 9, data.mousePlaca || '', baseStyle)
  
  r = 11
  setCell(r, 0, 'Disco Duro', boldStyle)
  setCell(r, 1, 'Capacidad', boldStyle)
  setCell(r, 2, 'Tipo', boldStyle)
  
  r = 12
  setCell(r, 0, data.discoDuro || '', baseStyle)
  setCell(r, 1, data.discoDuro || '', baseStyle)
  setCell(r, 2, 'ALL IN ONE', data.tipoEquipo === 'ALL IN ONE' ? yellowStyle : baseStyle)
  setCell(r, 3, 'PORTATIL', data.tipoEquipo === 'PORTATIL' ? yellowStyle : baseStyle)
  setCell(r, 4, 'CPU', data.tipoEquipo === 'CPU' ? yellowStyle : baseStyle)
  setCell(r, 5, data.cpu || '', baseStyle)
  setCell(r, 6, data.cpu || '', baseStyle)
  setCell(r, 7, data.cpu || '', baseStyle)
  setCell(r, 8, data.cpu || '', baseStyle)
  setCell(r, 9, data.cpu || '', baseStyle)
  
  r = 13
  setCell(r, 0, 'CONFIGURACIÓN DE RED', headerStyle)
  
  r = 14
  setCell(r, 0, 'Nombre del Equipo', boldStyle)
  setCell(r, 3, 'En red', boldStyle)
  setCell(r, 5, 'Dirección IP', boldStyle)
  setCell(r, 7, 'Mac', boldStyle)
  
  r = 15
  setCell(r, 0, data.nombreEquipo || '', baseStyle)
  setCell(r, 1, data.nombreEquipo || '', baseStyle)
  setCell(r, 2, data.nombreEquipo || '', baseStyle)
  setCell(r, 3, 'SI', data.enRed === 'SI' ? yellowStyle : baseStyle)
  setCell(r, 4, 'NO', data.enRed === 'NO' ? yellowStyle : baseStyle)
  setCell(r, 5, data.direccionIp || '', baseStyle)
  setCell(r, 6, data.direccionIp || '', baseStyle)
  setCell(r, 7, data.mac || '', baseStyle)
  setCell(r, 8, data.mac || '', baseStyle)
  setCell(r, 9, data.mac || '', baseStyle)
  
  r = 16
  setCell(r, 0, 'SISTEMA OPERATIVO INSTALADO', headerStyle)
  
  r = 17
  setCell(r, 0, data.sistemaOperativo || '', baseStyle)
  
  ws['!merges'] = [
    { s: { r: 0, c: 1 }, e: { r: 0, c: 4 } },
    { s: { r: 0, c: 6 }, e: { r: 0, c: 9 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } },
    { s: { r: 2, c: 1 }, e: { r: 2, c: 5 } },
    { s: { r: 2, c: 7 }, e: { r: 2, c: 9 } },
    { s: { r: 3, c: 1 }, e: { r: 3, c: 5 } },
    { s: { r: 3, c: 7 }, e: { r: 3, c: 9 } },
    { s: { r: 4, c: 7 }, e: { r: 4, c: 9 } },
    { s: { r: 5, c: 1 }, e: { r: 5, c: 5 } },
    { s: { r: 5, c: 7 }, e: { r: 5, c: 9 } },
    { s: { r: 6, c: 1 }, e: { r: 6, c: 5 } },
    { s: { r: 6, c: 7 }, e: { r: 6, c: 9 } },
    { s: { r: 7, c: 7 }, e: { r: 7, c: 9 } },
    { s: { r: 8, c: 1 }, e: { r: 8, c: 3 } },
    { s: { r: 8, c: 7 }, e: { r: 8, c: 9 } },
    { s: { r: 9, c: 1 }, e: { r: 9, c: 5 } },
    { s: { r: 9, c: 7 }, e: { r: 9, c: 9 } },
    { s: { r: 10, c: 7 }, e: { r: 10, c: 9 } },
    { s: { r: 11, c: 1 }, e: { r: 11, c: 2 } },
    { s: { r: 12, c: 1 }, e: { r: 12, c: 2 } },
    { s: { r: 12, c: 6 }, e: { r: 12, c: 9 } },
    { s: { r: 13, c: 0 }, e: { r: 13, c: 9 } },
    { s: { r: 14, c: 0 }, e: { r: 14, c: 2 } },
    { s: { r: 14, c: 5 }, e: { r: 14, c: 6 } },
    { s: { r: 14, c: 7 }, e: { r: 14, c: 9 } },
    { s: { r: 15, c: 0 }, e: { r: 15, c: 2 } },
    { s: { r: 15, c: 6 }, e: { r: 15, c: 7 } },
    { s: { r: 15, c: 8 }, e: { r: 15, c: 9 } },
    { s: { r: 16, c: 0 }, e: { r: 16, c: 9 } },
    { s: { r: 17, c: 0 }, e: { r: 17, c: 9 } },
  ]
  
  const colWidths = [
    { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
    { wch: 25 }, { wch: 10 }, { wch: 15 }, { wch: 15 }
  ]
  ws['!cols'] = colWidths
  
  XLSX.utils.book_append_sheet(workbook, ws, 'HojaVida')
  
  const fileName = `HojaVida_${data.inventario || 'EQUIPO'}_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(workbook, fileName)
  
  return fileName
}

export async function generarHojaVidaPDF(data) {
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
