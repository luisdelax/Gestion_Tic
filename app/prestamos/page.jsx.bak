'use client'

import { useState, useEffect } from 'react'
import CRUDBase, { DataTable, Modal, Button, Input, useUpperCase } from '@/components/CRUDBase'
import { Plus, CheckCircle, Clock, XCircle } from 'lucide-react'

const estadosPrestamo = [
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'Aprobado', label: 'Aprobado' },
  { value: 'Rechazado', label: 'Rechazado' },
  { value: 'Devuelto', label: 'Devuelto' },
]

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState([])
  const [equipos, setEquipos] = useState([])
  const [perifericos, setPerifericos] = useState([])
  const [audiovisuales, setAudiovisuales] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  const observaciones = useUpperCase('')

  const [formData, setFormData] = useState({
    equipoComputoId: '',
    perifericoId: '',
    audiovisualId: '',
    fechaPrestamo: '',
    fechaDevolucion: '',
    estado: 'Pendiente',
    observaciones: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [prestamosRes, equiposRes, perifericosRes, audiovisualesRes] = await Promise.all([
        fetch('/api/prestamos'),
        fetch('/api/equipos/computo?estado=Disponible'),
        fetch('/api/perifericos?estado=Disponible'),
        fetch('/api/audiovisuales?estado=Disponible'),
      ])
      
      if (prestamosRes.ok) setPrestamos(await prestamosRes.json())
      if (equiposRes.ok) setEquipos(await equiposRes.json())
      if (perifericosRes.ok) setPerifericos(await perifericosRes.json())
      if (audiovisualesRes.ok) setAudiovisuales(await audiovisualesRes.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editData ? `/api/prestamos/${editData.id}` : '/api/prestamos'
      const method = editData ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipoComputoId: formData.equipoComputoId || null,
          perifericoId: formData.perifericoId || null,
          audiovisualId: formData.audiovisualId || null,
          fechaPrestamo: formData.fechaPrestamo,
          fechaDevolucion: formData.fechaDevolucion || null,
          estado: formData.estado,
          observaciones: observaciones.value,
        }),
      })

      if (res.ok) {
        setModalOpen(false)
        setEditData(null)
        resetForm()
        fetchData()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al guardar')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (prestamo) => {
    setEditData(prestamo)
    observaciones.setValue(prestamo.observaciones || '')
    setFormData({
      equipoComputoId: prestamo.equipoComputoId || '',
      perifericoId: prestamo.perifericoId || '',
      audiovisualId: prestamo.audiovisualId || '',
      fechaPrestamo: prestamo.fechaPrestamo?.split('T')[0] || '',
      fechaDevolucion: prestamo.fechaDevolucion?.split('T')[0] || '',
      estado: prestamo.estado,
      observaciones: prestamo.observaciones || '',
    })
    setModalOpen(true)
  }

  const handleDelete = async (prestamo) => {
    if (!confirm(`¿Eliminar préstamo?`)) return
    
    try {
      const res = await fetch(`/api/prestamos/${prestamo.id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchData()
      } else {
        alert('Error al eliminar')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const resetForm = () => {
    observaciones.setValue('')
    setFormData({
      equipoComputoId: '',
      perifericoId: '',
      audiovisualId: '',
      fechaPrestamo: '',
      fechaDevolucion: '',
      estado: 'Pendiente',
      observaciones: '',
    })
  }

  const getEquipoLabel = (prestamo) => {
    if (prestamo.equipoComputo) return `${prestamo.equipoComputo.marca} ${prestamo.equipoComputo.modelo} (${prestamo.equipoComputo.serial})`
    if (prestamo.periferico) return `${prestamo.periferico.marca} ${prestamo.periferico.tipo}`
    if (prestamo.audiovisual) return `${prestamo.audiovisual.marca} ${prestamo.audiovisual.tipo}`
    return '-'
  }

  const getEstadoBadge = (estado) => {
    const config = {
      Pendiente: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
      Aprobado: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
      Rechazado: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
      Devuelto: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: CheckCircle },
    }
    const labels = { Pendiente: 'Pendiente', Aprobado: 'Aprobado', Rechazado: 'Rechazado', Devuelto: 'Devuelto' }
    const { icon: Icon } = config[estado]
    return (
      <span className={`px-2 py-1 rounded-full text-xs border flex items-center gap-1 w-fit ${config[estado].color}`}>
        <Icon size={12} /> {labels[estado]}
      </span>
    )
  }

  const columns = [
    { key: 'usuario', header: 'Usuario', render: (val) => val ? `${val.nombre} ${val.apellido}` : '-' },
    { key: 'equipo', header: 'Equipo', render: (_, row) => getEquipoLabel(row) },
    { key: 'fechaPrestamo', header: 'Fecha Préstamo', render: (val) => val ? new Date(val).toLocaleDateString('es-CO') : '-' },
    { key: 'fechaDevolucion', header: 'Fecha Devolución', render: (val) => val ? new Date(val).toLocaleDateString('es-CO') : '-' },
    { key: 'estado', header: 'Estado', render: (val) => getEstadoBadge(val) },
  ]

  return (
    <CRUDBase title="Préstamos" subtitle="Gestión de préstamos de equipos">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => { resetForm(); setEditData(null); setModalOpen(true) }}>
          <span className="flex items-center gap-2">
            <Plus size={18} /> Nuevo Préstamo
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
          data={prestamos} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchFields={['estado', 'observaciones']}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Actualizar Préstamo' : 'Nuevo Préstamo'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Equipo de Cómputo" 
            type="select" 
            value={formData.equipoComputoId} 
            onChange={(e) => setFormData({...formData, equipoComputoId: e.target.value, perifericoId: '', audiovisualId: ''})} 
            options={[{ value: '', label: 'Seleccionar...' }, ...equipos.map(e => ({ value: e.id, label: `${e.marca} ${e.modelo} - ${e.serial}` }))]} 
          />
          
          <Input 
            label="Periférico" 
            type="select" 
            value={formData.perifericoId} 
            onChange={(e) => setFormData({...formData, perifericoId: e.target.value, equipoComputoId: '', audiovisualId: ''})} 
            options={[{ value: '', label: 'Seleccionar...' }, ...perifericos.map(p => ({ value: p.id, label: `${p.marca} ${p.tipo} - ${p.serial || 'Sin serial'}` }))]} 
          />
          
          <Input 
            label="Equipo Audiovisual" 
            type="select" 
            value={formData.audiovisualId} 
            onChange={(e) => setFormData({...formData, audiovisualId: e.target.value, equipoComputoId: '', perifericoId: ''})} 
            options={[{ value: '', label: 'Seleccionar...' }, ...audiovisuales.map(a => ({ value: a.id, label: `${a.marca} ${a.tipo} - ${a.serial}` }))]} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Fecha Préstamo" type="date" value={formData.fechaPrestamo} onChange={(e) => setFormData({...formData, fechaPrestamo: e.target.value})} required />
            <Input label="Fecha Devolución" type="date" value={formData.fechaDevolucion} onChange={(e) => setFormData({...formData, fechaDevolucion: e.target.value})} />
          </div>

          {editData && (
            <Input label="Estado" type="select" value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} options={estadosPrestamo} />
          )}

          <Input label="Observaciones" type="textarea" {...observaciones} placeholder="OBSERVACIONES..." />
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editData ? 'Actualizar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>
    </CRUDBase>
  )
}
