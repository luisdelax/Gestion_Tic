'use client'

import { useState, useEffect } from 'react'
import CRUDBase, { DataTable, Modal, Button, Input, useUpperCase } from '@/components/CRUDBase'
import { Plus, Calendar, CheckCircle, Clock, XCircle, Search } from 'lucide-react'

const estadosReserva = [
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'Aprobado', label: 'Aprobado' },
  { value: 'Rechazado', label: 'Rechazado' },
  { value: 'Cancelado', label: 'Cancelado' },
]

export default function AuditorioPage() {
  const [reservas, setReservas] = useState([])
  const [funcionarios, setFuncionarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [searchFuncionario, setSearchFuncionario] = useState('')
  const [showFuncionarioList, setShowFuncionarioList] = useState(false)

  const evento = useUpperCase('')
  const solicitante = useUpperCase('')
  const dependencia = useUpperCase('')
  const observaciones = useUpperCase('')

  const [formData, setFormData] = useState({
    evento: '',
    solicitante: '',
    dependencia: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'Pendiente',
    observaciones: '',
  })

  useEffect(() => {
    fetchData()
  }, [selectedDate])

  const fetchData = async () => {
    try {
      const [reservasRes, funcionariosRes] = await Promise.all([
        fetch('/api/auditorio'),
        fetch('/api/funcionarios')
      ])
      
      if (reservasRes.ok) setReservas(await reservasRes.json())
      if (funcionariosRes.ok) setFuncionarios(await funcionariosRes.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReservas = async () => {
    try {
      const res = await fetch(`/api/auditorio?fecha=${selectedDate}`)
      if (res.ok) {
        const allReservas = await fetch('/api/auditorio')
        setReservas(allReservas.ok ? await allReservas.json() : [])
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
      const url = editData ? `/api/auditorio/${editData.id}` : '/api/auditorio'
      const method = editData ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evento: evento.value,
          solicitante: solicitante.value,
          dependencia: dependencia.value,
          fechaInicio: formData.fechaInicio,
          fechaFin: formData.fechaFin,
          estado: formData.estado,
          observaciones: observaciones.value,
        }),
      })

      if (res.ok) {
        setModalOpen(false)
        setEditData(null)
        resetForm()
        fetchReservas()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al guardar')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (reserva) => {
    setEditData(reserva)
    evento.setValue(reserva.evento)
    solicitante.setValue(reserva.solicitante)
    dependencia.setValue(reserva.dependencia)
    observaciones.setValue(reserva.observaciones || '')
    setFormData({
      evento: reserva.evento,
      solicitante: reserva.solicitante,
      dependencia: reserva.dependencia,
      fechaInicio: reserva.fechaInicio?.slice(0, 16) || '',
      fechaFin: reserva.fechaFin?.slice(0, 16) || '',
      estado: reserva.estado,
      observaciones: reserva.observaciones || '',
    })
    setModalOpen(true)
  }

  const handleDelete = async (reserva) => {
    if (!confirm(`¿Eliminar reserva "${reserva.evento}"?`)) return
    
    try {
      const res = await fetch(`/api/auditorio/${reserva.id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchReservas()
      } else {
        alert('Error al eliminar')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const selectFuncionario = (func) => {
    solicitante.setValue(`${func.nombre} ${func.apellido}`)
    dependencia.setValue(func.dependencia || '')
    setSearchFuncionario('')
    setShowFuncionarioList(false)
  }

  const filteredFuncionarios = searchFuncionario 
    ? funcionarios.filter(f => 
        `${f.nombre} ${f.apellido}`.toLowerCase().includes(searchFuncionario.toLowerCase()) ||
        f.cedula?.includes(searchFuncionario)
      )
    : funcionarios

  const resetForm = () => {
    evento.setValue('')
    solicitante.setValue('')
    dependencia.setValue('')
    observaciones.setValue('')
    setSearchFuncionario('')
    setFormData({
      evento: '',
      solicitante: '',
      dependencia: '',
      fechaInicio: '',
      fechaFin: '',
      estado: 'Pendiente',
      observaciones: '',
    })
  }

  const getEstadoBadge = (estado) => {
    const config = {
      Pendiente: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
      Aprobado: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
      Rechazado: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
      Cancelado: { color: 'bg-slate-500/20 text-slate-400 border-slate-500/30', icon: XCircle },
    }
    const labels = { Pendiente: 'Pendiente', Aprobado: 'Aprobado', Rechazado: 'Rechazado', Cancelado: 'Cancelado' }
    const { icon: Icon } = config[estado]
    return (
      <span className={`px-2 py-1 rounded-full text-xs border flex items-center gap-1 w-fit ${config[estado].color}`}>
        <Icon size={12} /> {labels[estado]}
      </span>
    )
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleString('es-CO', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const columns = [
    { key: 'evento', header: 'Evento' },
    { key: 'solicitante', header: 'Solicitante' },
    { key: 'dependencia', header: 'Dependencia' },
    { key: 'fechaInicio', header: 'Inicio', render: (val) => formatDateTime(val) },
    { key: 'fechaFin', header: 'Fin', render: (val) => formatDateTime(val) },
    { key: 'estado', header: 'Estado', render: (val) => getEstadoBadge(val) },
  ]

  const groupedReservas = reservas.reduce((acc, reserva) => {
    const date = new Date(reserva.fechaInicio).toLocaleDateString('es-CO')
    if (!acc[date]) acc[date] = []
    acc[date].push(reserva)
    return acc
  }, {})

  return (
    <CRUDBase title="Auditorio" subtitle="Gestión de reservas del auditorio">
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-green-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400/50"
          />
        </div>
        <Button onClick={() => { resetForm(); setEditData(null); setModalOpen(true) }}>
          <span className="flex items-center gap-2">
            <Plus size={18} /> Nueva Reserva
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
        <div className="space-y-6">
          {Object.keys(groupedReservas).length === 0 && (
            <div className="text-center p-8 text-slate-500">
              No hay reservas para mostrar
            </div>
          )}
          {Object.entries(groupedReservas).map(([date, dayReservas]) => (
            <div key={date} className="bg-slate-800/50 border border-green-500/20 rounded-xl overflow-hidden">
              <div className="bg-slate-950/50 px-4 py-3 border-b border-green-500/20">
                <h3 className="text-green-400 font-medium">{date}</h3>
              </div>
              <DataTable 
                columns={columns} 
                data={dayReservas} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Editar Reserva' : 'Nueva Reserva'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Evento" {...evento} required placeholder="NOMBRE DEL EVENTO" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block mb-1.5 md:mb-2 text-xs md:text-sm font-medium text-green-300/90">Solicitante</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchFuncionario || solicitante.value}
                  onChange={(e) => {
                    setSearchFuncionario(e.target.value)
                    solicitante.setValue(e.target.value)
                    setShowFuncionarioList(true)
                  }}
                  onFocus={() => setShowFuncionarioList(true)}
                  placeholder="BUSCAR FUNCIONARIO..."
                  className="w-full px-3 py-2 md:py-2.5 bg-slate-800/50 border border-green-500/30 rounded-lg text-white text-sm md:text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 uppercase"
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
              
              {showFuncionarioList && filteredFuncionarios.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-green-500/30 rounded-lg max-h-48 overflow-y-auto">
                  {filteredFuncionarios.slice(0, 8).map((func) => (
                    <button
                      key={func.id}
                      type="button"
                      onClick={() => selectFuncionario(func)}
                      className="w-full text-left px-3 py-2 text-white hover:bg-slate-700 border-b border-green-500/10 last:border-0"
                    >
                      <p className="text-sm font-medium">{func.nombre} {func.apellido}</p>
                      <p className="text-xs text-slate-400">{func.cedula} - {func.dependencia}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Input label="Dependencia" {...dependencia} required placeholder="ÁREA O DEPENDENCIA" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Fecha y Hora Inicio" type="datetime-local" value={formData.fechaInicio} onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})} required />
            <Input label="Fecha y Hora Fin" type="datetime-local" value={formData.fechaFin} onChange={(e) => setFormData({...formData, fechaFin: e.target.value})} required />
          </div>

          {editData && (
            <Input label="Estado" type="select" value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} options={estadosReserva} />
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
