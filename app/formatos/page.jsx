'use client'

import { useState } from 'react'
import CRUDBase, { Button } from '@/components/CRUDBase'
import { FileText, Download, Plus } from 'lucide-react'
import HojaVidaForm from './HojaVidaForm'

const formatos = [
  {
    id: 'hojavida',
    nombre: 'Hoja de Vida Equipos',
    descripcion: 'Formato para registrar la hoja de vida de equipos de cómputo',
    icon: FileText,
    color: 'bg-blue-500/20 text-blue-400',
  },
]

export default function FormatosPage() {
  const [formatoSeleccionado, setFormatoSeleccionado] = useState(null)

  if (formatoSeleccionado === 'hojavida') {
    return <HojaVidaForm onBack={() => setFormatoSeleccionado(null)} />
  }

  return (
    <CRUDBase title="Formatos" subtitle="Gestión de formatos institucionales SENA">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formatos.map((formato) => (
          <div
            key={formato.id}
            className="bg-slate-800/50 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all cursor-pointer"
            onClick={() => setFormatoSeleccionado(formato.id)}
          >
            <div className={`w-12 h-12 ${formato.color} rounded-lg flex items-center justify-center mb-4`}>
              <formato.icon size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{formato.nombre}</h3>
            <p className="text-sm text-slate-400">{formato.descripcion}</p>
            <div className="mt-4 flex gap-2">
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Nuevo
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CRUDBase>
  )
}
