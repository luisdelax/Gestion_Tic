'use client'

export default function HojaVidaPreview({ data }) {
  return (
    <div className="bg-white p-6 text-black text-sm overflow-auto max-h-[70vh]">
      <table className="w-full border-collapse border border-black">
        <tbody>
          <tr className="border border-black">
            <td colSpan={3} className="border border-black p-2 font-bold bg-gray-100">
              Responsable
            </td>
            <td colSpan={3} className="border border-black p-2 font-bold bg-gray-100">
              Área
            </td>
            <td colSpan={2} className="border border-black p-2">
              {data.area || '-'}
            </td>
          </tr>
          <tr className="border border-black">
            <td colSpan={7} className="border border-black p-2 font-bold bg-gray-200">
              DATOS DEL EQUIPO
            </td>
          </tr>
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold w-1/4">Nº Inventario</td>
            <td colSpan={3} className="border border-black p-2">{data.inventario || '-'}</td>
            <td className="border border-black p-2 font-bold">Marca y/o Modelo Monitor</td>
            <td colSpan={2} className="border border-black p-2">{data.monitorMarca || '-'}</td>
          </tr>
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold">Marca</td>
            <td colSpan={3} className="border border-black p-2">{data.marca || '-'}</td>
            <td className="border border-black p-2 font-bold">Serial Monitor</td>
            <td colSpan={2} className="border border-black p-2">{data.monitorSerial || '-'}</td>
          </tr>
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold">Placa Monitor</td>
            <td colSpan={3} className="border border-black p-2">{data.monitorPlaca || '-'}</td>
            <td className="border border-black p-2 font-bold">Marca y/o Modelo Teclado</td>
            <td colSpan={2} className="border border-black p-2">{data.tecladoMarca || '-'}</td>
          </tr>
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold">Modelo</td>
            <td colSpan={3} className="border border-black p-2">{data.modelo || '-'}</td>
            <td className="border border-black p-2 font-bold">Serial Teclado</td>
            <td colSpan={2} className="border border-black p-2">{data.tecladoSerial || '-'}</td>
          </tr>
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold">Serial CPU</td>
            <td colSpan={3} className="border border-black p-2">{data.serialCpu || '-'}</td>
            <td className="border border-black p-2 font-bold">Placa Teclado</td>
            <td colSpan={2} className="border border-black p-2">{data.tecladoPlaca || '-'}</td>
          </tr>
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold">Procesador</td>
            <td colSpan={3} className="border border-black p-2">{data.procesador || '-'}</td>
            <td className="border border-black p-2 font-bold">Velocidad</td>
            <td colSpan={2} className="border border-black p-2">{data.velocidad || '-'}</td>
          </tr>
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold"></td>
            <td colSpan={3} className="border border-black p-2"></td>
            <td className="border border-black p-2 font-bold">Marca y/o Modelo Mouse</td>
            <td colSpan={2} className="border border-black p-2">{data.mouseMarca || '-'}</td>
          </tr>
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold">Memoria RAM</td>
            <td colSpan={3} className="border border-black p-2">{data.memoriaRam || '-'}</td>
            <td className="border border-black p-2 font-bold">Serial Mouse</td>
            <td colSpan={2} className="border border-black p-2">{data.mouseSerial || '-'}</td>
          </tr>
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold"></td>
            <td colSpan={3} className="border border-black p-2"></td>
            <td className="border border-black p-2 font-bold">Placa Mouse</td>
            <td colSpan={2} className="border border-black p-2">{data.mousePlaca || '-'}</td>
          </tr>
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold">Disco Duro</td>
            <td className="border border-black p-2 font-bold">Capacidad</td>
            <td colSpan={2} className="border border-black p-2">{data.discoDuro || '-'}</td>
            <td className="border border-black p-2 font-bold">Tipo</td>
            <td colSpan={2} className="border border-black p-2">{data.tipoEquipo || '-'}</td>
          </tr>
          <tr className="border border-black">
            <td colSpan={7} className="border border-black p-2 font-bold bg-gray-200">
              CONFIGURACIÓN DE RED
            </td>
          </tr>
          <tr className="border border-black">
            <td className="border border-black p-2 font-bold">Nombre del Equipo</td>
            <td className="border border-black p-2 font-bold">En red</td>
            <td className="border border-black p-2 font-bold"></td>
            <td className="border border-black p-2 font-bold">Dirección IP</td>
            <td className="border border-black p-2 font-bold"></td>
            <td className="border border-black p-2 font-bold">MAC</td>
            <td className="border border-black p-2 font-bold"></td>
          </tr>
          <tr className="border border-black">
            <td className="border border-black p-2">{data.nombreEquipo || '-'}</td>
            <td className="border border-black p-2">{data.enRed || '-'}</td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2">{data.direccionIp || '-'}</td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2">{data.mac || '-'}</td>
            <td className="border border-black p-2"></td>
          </tr>
          <tr className="border border-black">
            <td colSpan={7} className="border border-black p-2 font-bold bg-gray-200">
              SISTEMA OPERATIVO INSTALADO
            </td>
          </tr>
          <tr className="border border-black">
            <td colSpan={7} className="border border-black p-2">
              {data.sistemaOperativo || '-'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
