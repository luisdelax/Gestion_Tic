import * as XLSX from 'xlsx'

export async function generarHojaVidaExcel(data) {
  const workbook = XLSX.utils.book_new()
  
  const worksheet = []
  
  for (let i = 0; i < 25; i++) {
    worksheet.push(new Array(42).fill(null))
  }

  worksheet[0][0] = 'Responsable'
  worksheet[1][0] = ' DATOS DEL EQUIPO'
  worksheet[2][0] = 'Nº Inventario'
  worksheet[2][6] = data.inventario || ''
  worksheet[2][17] = 'Marca y/o Modelo Monitor'
  worksheet[2][25] = data.monitorMarca || ''
  
  worksheet[3][0] = 'Marca'
  worksheet[3][6] = data.marca || ''
  worksheet[3][17] = 'Serial Monitor'
  worksheet[3][25] = data.monitorSerial || ''
  
  worksheet[4][17] = 'Placa Monitor'
  worksheet[4][25] = data.monitorPlaca || ''
  
  worksheet[5][0] = 'Modelo'
  worksheet[5][6] = data.modelo || ''
  worksheet[5][17] = 'Marca y/o Modelo Teclado'
  worksheet[5][25] = data.tecladoMarca || ''
  
  worksheet[6][0] = 'Serial CPU'
  worksheet[6][6] = data.serialCpu || ''
  worksheet[6][17] = 'Serial Teclado'
  worksheet[6][25] = data.tecladoSerial || ''
  
  worksheet[7][17] = 'Placa Teclado'
  worksheet[7][25] = data.tecladoPlaca || ''
  
  worksheet[8][0] = 'Procesador'
  worksheet[8][6] = data.procesador || ''
  worksheet[8][12] = 'Velocidad'
  worksheet[8][15] = data.velocidad || ''
  worksheet[8][17] = 'Marca y/o Modelo Mouse'
  worksheet[8][25] = data.mouseMarca || ''
  
  worksheet[9][0] = 'Memoria RAM'
  worksheet[9][6] = data.memoriaRam || ''
  worksheet[9][17] = 'Serial Mouse'
  worksheet[9][25] = data.mouseSerial || ''
  
  worksheet[10][17] = 'Placa Mouse'
  worksheet[10][25] = data.mousePlaca || ''
  
  worksheet[11][0] = 'Disco Duro'
  worksheet[11][6] = 'Capacidad'
  worksheet[11][12] = 'Tipo'
  
  worksheet[12][6] = data.discoDuro || ''
  worksheet[12][12] = data.tipoEquipo || ''
  worksheet[12][14] = 'PORTATIL'
  worksheet[12][18] = 'CPU'
  
  worksheet[13][0] = ' CONFIGURACION DE RED'
  
  worksheet[14][0] = 'Nombre del Equipo'
  worksheet[14][10] = 'En red'
  worksheet[14][13] = 'Dirección IP'
  worksheet[14][20] = 'Mac'
  
  worksheet[15][0] = data.nombreEquipo || ''
  worksheet[15][10] = data.enRed || ''
  worksheet[15][13] = data.direccionIp || ''
  worksheet[15][20] = data.mac || ''
  
  worksheet[16][0] = 'SISTEMA OPERATIVO INSTALADO'
  
  worksheet[17][0] = data.sistemaOperativo || ''
  
  worksheet[1][17] = 'Area'
  worksheet[1][23] = data.area || ''

  const ws = XLSX.utils.aoa_to_sheet(worksheet)

  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 16 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 16 } },
    { s: { r: 13, c: 0 }, e: { r: 13, c: 16 } },
    { s: { r: 16, c: 0 }, e: { r: 16, c: 16 } },
  ]

  const colWidths = [
    { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 20 }, { wch: 10 }, { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
  ]
  ws['!cols'] = colWidths

  XLSX.utils.book_append_sheet(workbook, ws, 'Hojas de Vida Equipos')

  const fileName = `HojaVida_${data.inventario || 'EQUIPO'}_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(workbook, fileName)
  
  return fileName
}

export function asignarPlacasComoEvidencia(equipoId, placas) {
  return {
    equipoId,
    placas: [
      { tipo: 'Monitor', placa: placas.monitor },
      { tipo: 'Teclado', placa: placas.teclado },
      { tipo: 'Mouse', placa: placas.mouse },
    ].filter(p => p.placa),
  }
}
