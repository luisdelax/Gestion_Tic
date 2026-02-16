'use client'

import { useState, useEffect } from 'react'
import CRUDBase, { DataTable, Modal, Button, Input, useUpperCase } from '@/components/CRUDBase'
import { Plus } from 'lucide-react'
import { TIPOS_PERIFERICOS, MARCAS_PERIFERICOS, COLORES } from '@/lib/constantes'

const estadosEquipo = [
  { value: 'Disponible', label: 'Disponible' },
  { value: 'Asignado', label: 'Asignado' },
  { value: 'EnReparacion', label: 'En Reparación' },
  { value: 'DadoDeBaja', label: 'Dado de Baja' },
]

export default function PerifericosPage() {
  const [perifericos, setPerifericos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  const modelo = useUpperCase('')
  const serial = useUpperCase('')
  const color = useUpperCase('')
  const ubicacion = useUpperCase('')
  const dependencia = useUpperCase('')
  const observaciones = useUpperCase('')

  const [formData, setFormData] = useState({
    tipo: '',
    marca: '',
    modelo: '',
    serial: '',
    color: '',
    estado: 'Disponible',
    ubicacion: '',
    dependencia: '',
    fechaAdquisicion: '',
    observaciones: '',
  })

  useEffect(() => {
    fetchPerifericos()
  }, [])

  const fetchPerifericos = async () => {
    try {
      const res = await fetch('/api/perifericos', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setPerifericos(data)
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
      const url = editData ? `/api/perifericos/${editData.id}` : '/api/perifericos'
      const method = editData ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: formData.tipo,
          marca: formData.marca,
          modelo: modelo.value,
          serial: serial.value || null,
          color: color.value || null,
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
        fetchPerifericos()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al guardar')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (periferico) => {
    setEditData(periferico)
    modelo.setValue(periferico.modelo)
    serial.setValue(periferico.serial || '')
    color.setValue(periferico.color || '')
    ubicacion.setValue(periferico.ubicacion || '')
    dependencia.setValue(periferico.dependencia || '')
    observaciones.setValue(periferico.observaciones || '')
    setFormData({
      tipo: periferico.tipo,
      marca: periferico.marca,
      color: periferico.color || '',
      estado: periferico.estado,
      fechaAdquisicion: periferico.fechaAdquisicion?.split('T')[0] || '',
    })
    setModalOpen(true)
  }

  const handleDelete = async (periferico) => {
    if (!confirm(`¿Eliminar ${periferico.tipo} ${periferico.marca}?`)) return
    
    try {
      const res = await fetch(`/api/perifericos/${periferico.id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchPerifericos()
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
    color.setValue('')
    ubicacion.setValue('')
    dependencia.setValue('')
    observaciones.setValue('')
    setFormData({
      tipo: '',
      marca: '',
      modelo: '',
      serial: '',
      color: '',
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
      Mouse: 'Mouse',
      Teclado: 'Teclado',
      AdaptadorUSB: 'Adaptador USB',
      MemoriaSD: 'Memoria SD',
      Audifonos: 'Audífonos',
      Webcam: 'Webcam',
      DiscoExterno: 'Disco Externo',
    }
    return labels[tipo] || tipo
  }

  const columns = [
    { key: 'tipo', header: 'Tipo', render: (val) => getTipoLabel(val) },
    { key: 'marca', header: 'Marca' },
    { key: 'modelo', header: 'Modelo' },
    { key: 'serial', header: 'Serial' },
    { key: 'estado', header: 'Estado', render: (val) => getEstadoBadge(val) },
    { key: 'ubicacion', header: 'Ubicación' },
  ]

  return (
    <CRUDBase title="Periféricos" subtitle="Gestión de periféricos y accesorios">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => { resetForm(); setEditData(null); setModalOpen(true) }}>
          <span className="flex items-center gap-2">
            <Plus size={18} /> Nuevo Periférico
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
          data={perifericos} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchFields={['tipo', 'marca', 'modelo', 'serial', 'ubicacion']}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Editar Periférico' : 'Nuevo Periférico'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Tipo" type="select" value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} options={TIPOS_PERIFERICOS} />
            <Input label="Estado" type="select" value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} options={estadosEquipo} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Marca" type="select" value={formData.marca} onChange={(e) => setFormData({...formData, marca: e.target.value})} options={MARCAS_PERIFERICOS} />
            <Input label="Modelo" {...modelo} required placeholder="M90" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Serial (Opcional)" {...serial} placeholder="SN123456" />
            <Input label="Color" type="select" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} options={COLORES} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Ubicación" {...ubicacion} placeholder="OFICINA 101" />
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
