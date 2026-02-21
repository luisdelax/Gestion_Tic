'use client'

import { useState } from 'react'
import CRUDBase, { Button } from '@/components/CRUDBase'
import { FileText, Download, Plus, List } from 'lucide-react'
import HojaVidaForm from './HojaVidaForm'
import HojaVidaList from './HojaVidaList'

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
  const [view, setView] = useState('menu')
  const [editData, setEditData] = useState(null)

  const handleNuevo = () => {
    setEditData(null)
    setView('form')
  }

  const handleEditar = (data) => {
    setEditData(data)
    setView('form')
  }

  const handleBack = () => {
    setView('menu')
    setEditData(null)
  }

  if (view === 'list') {
    return (
      <HojaVidaList 
        onNuevo={handleNuevo} 
        onEditar={handleEditar}
      />
    )
  }

  if (view === 'form') {
    return <HojaVidaForm onBack={handleBack} editData={editData} />
  }

  return (
    <CRUDBase title="Formatos" subtitle="Gestión de formatos institucionales SENA">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formatos.map((formato) => (
          <div
            key={formato.id}
            className="bg-slate-800/50 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all"
          >
            <div className={`w-12 h-12 ${formato.color} rounded-lg flex items-center justify-center mb-4`}>
              <formato.icon size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{formato.nombre}</h3>
            <p className="text-sm text-slate-400 mb-4">{formato.descripcion}</p>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleNuevo} className="flex items-center gap-2">
                <Plus size={16} />
                Nuevo
              </Button>
              <Button variant="secondary" onClick={() => setView('list')} className="flex items-center gap-2">
                <List size={16} />
                Ver Registros
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CRUDBase>
  )
}
