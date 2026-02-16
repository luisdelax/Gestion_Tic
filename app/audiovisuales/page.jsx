'use client'

import { useState, useEffect } from 'react'
import CRUDBase, { DataTable, Modal, Button, Input, useUpperCase } from '@/components/CRUDBase'
import { Plus } from 'lucide-react'
import { TIPOS_AUDIOVISUALES, MARCAS_AUDIOVISUALES, MODELOS_AUDIOVISUALES } from '@/lib/constantes'

const estadosEquipo = [
  { value: 'Disponible', label: 'Disponible' },
  { value: 'Asignado', label: 'Asignado' },
  { value: 'EnReparacion', label: 'En Reparación' },
  { value: 'DadoDeBaja', label: 'Dado de Baja' },
]

export default function AudiovisualesPage() {
  const [equipos, setEquipos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  const modelo = useUpperCase('')
  const serial = useUpperCase('')
  const placa = useUpperCase('')
  const ubicacion = useUpperCase('')
  const dependencia = useUpperCase('')
  const observaciones = useUpperCase('')

  const [formData, setFormData] = useState({
    tipo: '',
    marca: '',
    modelo: '',
    serial: '',
    placa: '',
    estado: 'Disponible',
    ubicacion: '',
    dependencia: '',
    fechaAdquisicion: '',
    observaciones: '',
  })

  useEffect(() => {
    fetchEquipos()
  }, [])

  const fetchEquipos = async () => {
    try {
      const res = await fetch('/api/audiovisuales', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setEquipos(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editData ? `/api/audiovisuales/${editData.id}` : '/api/audiovisuales'
      const method = editData ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: formData.tipo,
          marca: formData.marca,
          modelo: modelo.value,
          serial: serial.value,
          placa: placa.value || null,
          estado: formData.estado,
          ubicacion: ubicacion.value,
          dependencia: dependencia.value,
          fechaAdquisicion: formData.fechaAdquisicion,
          observaciones: observaciones.value,
        }),
      })

      if (res.ok) {
        setModalOpen(false)
        setEditData(null)
        resetForm()
        fetchEquipos()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al guardar')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (equipo) => {
    setEditData(equipo)
    modelo.setValue(equipo.modelo)
    serial.setValue(equipo.serial)
    placa.setValue(equipo.placa || '')
    ubicacion.setValue(equipo.ubicacion || '')
    dependencia.setValue(equipo.dependencia || '')
    observaciones.setValue(equipo.observaciones || '')
    setFormData({
      tipo: equipo.tipo,
      marca: equipo.marca,
      modelo: equipo.modelo,
      serial: equipo.serial,
      placa: equipo.placa || '',
      estado: equipo.estado,
      fechaAdquisicion: equipo.fechaAdquisicion?.split('T')[0] || '',
    })
    setModalOpen(true)
  }

  const handleDelete = async (equipo) => {
    if (!confirm(`¿Eliminar ${equipo.tipo} ${equipo.marca}?`)) return
    
    try {
      const res = await fetch(`/api/audiovisuales/${equipo.id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchEquipos()
      } else {
        alert('Error al eliminar')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const resetForm = () => {
    modelo.setValue('')
    serial.setValue('')
    placa.setValue('')
    ubicacion.setValue('')
    dependencia.setValue('')
    observaciones.setValue('')
    setFormData({
      tipo: '',
      marca: '',
      modelo: '',
      serial: '',
      placa: '',
      estado: 'Disponible',
      ubicacion: '',
      dependencia: '',
      fechaAdquisicion: '',
      observaciones: '',
    })
  }

  const getEstadoBadge = (estado) => {
    const colors = {
      Disponible: 'bg-green-500/20 text-green-400 border-green-500/30',
      Asignado: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      EnReparacion: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      DadoDeBaja: 'bg-red-500/20 text-red-400 border-red-500/30',
    }
    const labels = {
      Disponible: 'Disponible',
      Asignado: 'Asignado',
      EnReparacion: 'En Reparación',
      DadoDeBaja: 'Dado de Baja',
    }
    return <span className={`px-2 py-1 rounded-full text-xs border ${colors[estado]}`}>{labels[estado]}</span>
  }

  const getTipoLabel = (tipo) => {
    const labels = {
      VideoBeam: 'Video Beam',
      Proyector: 'Proyector',
      Microfono: 'Micrófono',
      Parlantes: 'Parlantes',
      Pantalla: 'Pantalla',
      Camara: 'Cámara',
    }
    return labels[tipo] || tipo
  }

  const columns = [
    { key: 'tipo', header: 'Tipo', render: (val) => getTipoLabel(val) },
    { key: 'marca', header: 'Marca' },
    { key: 'modelo', header: 'Modelo' },
    { key: 'serial', header: 'Serial' },
    { key: 'placa', header: 'Placa' },
    { key: 'estado', header: 'Estado', render: (val) => getEstadoBadge(val) },
    { key: 'ubicacion', header: 'Ubicación' },
  ]

  const modelosDisponibles = formData.marca ? MODELOS_AUDIOVISUALES[formData.marca] || [] : []

  return (
    <CRUDBase title="Equipos Audiovisuales" subtitle="Gestión de equipos de投影 y audio">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => { resetForm(); setEditData(null); setModalOpen(true) }}>
          <span className="flex items-center gap-2">
            <Plus size={18} /> Nuevo Equipo
          </span>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></span>
            <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={equipos} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchFields={['tipo', 'marca', 'modelo', 'serial', 'placa', 'ubicacion']}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Editar Equipo' : 'Nuevo Equipo Audiovisual'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Tipo" type="select" value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} options={TIPOS_AUDIOVISUALES} />
            <Input label="Estado" type="select" value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} options={estadosEquipo} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Marca" 
              type="select" 
              value={formData.marca} 
              onChange={(e) => { setFormData({...formData, marca: e.target.value, modelo: ''}); modelo.setValue('') }} 
              options={MARCAS_AUDIOVISUALES} 
            />
            <Input 
              label="Modelo" 
              type="select" 
              value={formData.modelo} 
              onChange={(e) => { setFormData({...formData, modelo: e.target.value}); modelo.setValue(e.target.value) }} 
              options={modelosDisponibles.map(m => ({ value: m, label: m }))} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Serial" {...serial} required placeholder="SN123456" />
            <Input label="Placa" {...placa} placeholder="VB-001" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Ubicación" {...ubicacion} placeholder="SALÓN 101" />
            <Input label="Dependencia" {...dependencia} placeholder="ÁREA" />
          </div>

          <Input label="Fecha Adquisición" type="date" value={formData.fechaAdquisicion} onChange={(e) => setFormData({...formData, fechaAdquisicion: e.target.value})} />
          
          <Input label="Observaciones" type="textarea" {...observaciones} placeholder="NOTAS ADICIONALES..." />
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editData ? 'Actualizar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>
    </CRUDBase>
  )
}
