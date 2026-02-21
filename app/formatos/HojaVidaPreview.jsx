'use client'

import { useState } from 'react'

export default function HojaVidaPreview({ data, onChange }) {
  const [tipoSeleccionado, setTipoSeleccionado] = useState(data.tipoEquipo || '')
  const [enRedSeleccionado, setEnRedSeleccionado] = useState(data.enRed || '')
  
  const handleTipoClick = (tipo) => {
    setTipoSeleccionado(tipo)
    if (onChange) {
      onChange({ ...data, tipoEquipo: tipo })
    }
  }
  
  const handleEnRedClick = (valor) => {
    setEnRedSeleccionado(valor)
    if (onChange) {
      onChange({ ...data, enRed: valor })
    }
  }
  
  const cellStyle = {
    border: '1px solid #000',
    padding: '6px 8px',
    textAlign: 'center',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '12px',
    cursor: 'pointer'
  }
  const headerBgStyle = {
    ...cellStyle,
    backgroundColor: '#d9d9d9',
    fontWeight: 'bold',
    cursor: 'default'
  }
  const boldStyle = {
    ...cellStyle,
    fontWeight: 'bold',
    cursor: 'default'
  }
  const yellowStyle = {
    ...cellStyle,
    backgroundColor: '#FFFF00',
    fontWeight: 'bold'
  }
  
  return (
    <div className="bg-white p-2 text-black overflow-auto max-h-[70vh]">
      <div id="hoja-vida-preview" style={{ minWidth: '750px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
          <tbody>
            <tr>
              <td style={{ ...headerBgStyle, width: '20%' }}>Responsable</td>
              <td colSpan={4} style={{ ...cellStyle, width: '30%' }}>{data.responsable || ''}</td>
              <td style={{ ...headerBgStyle, width: '15%' }}>Área</td>
              <td colSpan={3} style={{ ...cellStyle, width: '35%' }}>{data.area || ''}</td>
            </tr>
            <tr>
              <td colSpan={10} style={headerBgStyle}>DATOS DEL EQUIPO</td>
            </tr>
            <tr>
              <td style={boldStyle}>Nº Inventario</td>
              <td colSpan={5} style={cellStyle}>{data.inventario || ''}</td>
              <td colSpan={2} style={boldStyle}>Marca y/o Modelo Monitor</td>
              <td colSpan={2} style={cellStyle}>{data.monitorMarca || ''}</td>
            </tr>
            <tr>
              <td rowSpan={2} style={boldStyle}>Marca</td>
              <td rowSpan={2} colSpan={5} style={cellStyle}>{data.marca || ''}</td>
              <td colSpan={2} style={boldStyle}>Serial Monitor</td>
              <td colSpan={2} style={cellStyle}>{data.monitorSerial || ''}</td>
            </tr>
            <tr>
              <td colSpan={2} style={boldStyle}>Placa Monitor</td>
              <td colSpan={2} style={cellStyle}>{data.monitorPlaca || ''}</td>
            </tr>
            <tr>
              <td style={boldStyle}>Modelo</td>
              <td colSpan={5} style={cellStyle}>{data.modelo || ''}</td>
              <td colSpan={2} style={boldStyle}>Marca y/o Modelo Teclado</td>
              <td colSpan={2} style={cellStyle}>{data.tecladoMarca || ''}</td>
            </tr>
            <tr>
              <td rowSpan={2} style={boldStyle}>Serial CPU</td>
              <td rowSpan={2} colSpan={5} style={cellStyle}>{data.serialCpu || ''}</td>
              <td colSpan={2} style={boldStyle}>Serial Teclado</td>
              <td colSpan={2} style={cellStyle}>{data.tecladoSerial || ''}</td>
            </tr>
            <tr>
              <td colSpan={2} style={boldStyle}>Placa Teclado</td>
              <td colSpan={2} style={cellStyle}>{data.tecladoPlaca || ''}</td>
            </tr>
            <tr>
              <td style={boldStyle}>Procesador</td>
              <td colSpan={3} style={cellStyle}>{data.procesador || ''}</td>
              <td style={boldStyle}>Velocidad</td>
              <td style={cellStyle}>{data.velocidad || ''}</td>
              <td colSpan={2} style={boldStyle}>Marca y/o Modelo Mouse</td>
              <td colSpan={2} style={cellStyle}>{data.mouseMarca || ''}</td>
            </tr>
            <tr>
              <td rowSpan={2} style={boldStyle}>Memoria RAM</td>
              <td rowSpan={2} colSpan={5} style={cellStyle}>{data.memoriaRam || ''}</td>
              <td colSpan={2} style={boldStyle}>Serial Mouse</td>
              <td colSpan={2} style={cellStyle}>{data.mouseSerial || ''}</td>
            </tr>
            <tr>
              <td colSpan={2} style={boldStyle}>Placa Mouse</td>
              <td colSpan={2} style={cellStyle}>{data.mousePlaca || ''}</td>
            </tr>
            <tr>
              <td rowSpan={2} style={boldStyle}>Disco Duro</td>
              <td colSpan={3} style={boldStyle}>Capacidad</td>
              <td colSpan={3} style={boldStyle}>Tipo</td>
            </tr>
            <tr>
              <td colSpan={3} style={cellStyle}>{data.discoDuro || ''}</td>
              <td 
                onClick={() => handleTipoClick('ALL IN ONE')}
                style={tipoSeleccionado === 'ALL IN ONE' ? yellowStyle : cellStyle}
              >
                ALL IN ONE
              </td>
              <td 
                onClick={() => handleTipoClick('PORTATIL')}
                style={tipoSeleccionado === 'PORTATIL' ? yellowStyle : cellStyle}
              >
                PORTATIL
              </td>
              <td 
                onClick={() => handleTipoClick('CPU')}
                style={tipoSeleccionado === 'CPU' ? yellowStyle : cellStyle}
              >
                CPU
              </td>
            </tr>
            <tr>
              <td colSpan={9} style={headerBgStyle}>CONFIGURACIÓN DE RED</td>
            </tr>
            <tr>
              <td colSpan={3} style={boldStyle}>Nombre del Equipo</td>
              <td colSpan={2} style={boldStyle}>En red</td>
              <td colSpan={2} style={boldStyle}>Dirección IP</td>
              <td colSpan={2} style={boldStyle}>Mac</td>
            </tr>
            <tr>
              <td colSpan={3} style={cellStyle}>{data.nombreEquipo || ''}</td>
              <td 
                onClick={() => handleEnRedClick('SI')}
                style={enRedSeleccionado === 'SI' ? yellowStyle : cellStyle}
              >
                SI
              </td>
              <td 
                onClick={() => handleEnRedClick('NO')}
                style={enRedSeleccionado === 'NO' ? yellowStyle : cellStyle}
              >
                NO
              </td>
              <td colSpan={2} style={cellStyle}>{data.direccionIp || ''}</td>
              <td colSpan={2} style={cellStyle}>{data.mac || ''}</td>
            </tr>
            <tr>
              <td colSpan={10} style={headerBgStyle}>SISTEMA OPERATIVO INSTALADO</td>
            </tr>
            <tr>
              <td colSpan={10} style={{ ...cellStyle, padding: '10px' }}>{data.sistemaOperativo || ''}</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
          * Haz clic en las celdas de Tipo o En Red para seleccionar
        </p>
      </div>
    </div>
  )
}
