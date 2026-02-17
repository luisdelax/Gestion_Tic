'use client'

import { useState, useEffect } from 'react'
import CRUDBase, { DataTable, Modal, Button, Input, useUpperCase } from '@/components/CRUDBase'
import { Plus, Clock, CheckCircle, AlertTriangle, XCircle, User, Calendar, Flag, Bell, Trash2, Edit } from 'lucide-react'

const prioridades = [
  { value: 'Urgente', label: 'Urgente', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
  { value: 'Alta', label: 'Alta', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
  { value: 'Media', label: 'Media', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
  { value: 'Baja', label: 'Baja', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
]

const estados = [
  { value: 'Pendiente', label: 'Pendiente', color: 'text-slate-400', bg: 'bg-slate-500/20' },
  { value: 'EnProceso', label: 'En Proceso', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { value: 'Completada', label: 'Completada', color: 'text-green-400', bg: 'bg-green-500/20' },
  { value: 'Cancelada', label: 'Cancelada', color: 'text-red-400', bg: 'bg-red-500/20' },
]

export default function TareasPage() {
  const [tareas, setTareas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroPrioridad, setFiltroPrioridad] = useState('')
  const [misTareas, setMisTareas] = useState(false)
  const [overdueCount, setOverdueCount] = useState(0)

  const titulo = useUpperCase('')
  const descripcion = useUpperCase('')

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    prioridad: 'Media',
    asignadoAId: '',
    fechaLimite: '',
  })

  useEffect(() => {
    fetchData()
    const interval = setInterval(() => {
      fetchTareasVencidas()
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchData()
  }, [filtroEstado, filtroPrioridad, misTareas])

  const fetchData = async () => {
    try {
      const params = new URLSearchParams()
      if (filtroEstado) params.append('estado', filtroEstado)
      if (filtroPrioridad) params.append('prioridad', filtroPrioridad)
      if (misTareas) params.append('misTareas', 'true')

      const [tareasRes, usuariosRes] = await Promise.all([
        fetch(`/api/tareas?${params}`, { credentials: 'include' }),
        fetch('/api/usuarios', { credentials: 'include' }),
      ])

      if (tareasRes.ok) {
        const data = await tareasRes.json()
        setTareas(data.tareas)
        setOverdueCount(data.overdueCount || 0)
      }
      if (usuariosRes.ok) setUsuarios(await usuariosRes.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTareasVencidas = async () => {
    try {
      await fetch('/api/tareas/check', { credentials: 'include' })
    } catch (e) {}
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editData ? `/api/tareas/${editData.id}` : '/api/tareas'
      const method = editData ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          titulo: titulo.value,
          descripcion: descripcion.value,
          prioridad: formData.prioridad,
          asignadoAId: formData.asignadoAId || null,
          fechaLimite: formData.fechaLimite || null,
          ...(editData && { estado: formData.estado }),
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

  const handleEdit = (tarea) => {
    setEditData(tarea)
    titulo.setValue(tarea.titulo)
    descripcion.setValue(tarea.descripcion || '')
    setFormData({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion || '',
      prioridad: tarea.prioridad,
      asignadoAId: tarea.asignadoAId || '',
      fechaLimite: tarea.fechaLimite?.split('T')[0] || '',
      estado: tarea.estado,
    })
    setModalOpen(true)
  }

  const handleDelete = async (tarea) => {
    if (!confirm('¿Eliminar esta tarea?')) return
    try {
      const res = await fetch(`/api/tareas/${tarea.id}`, { method: 'DELETE', credentials: 'include' })
      if (res.ok) fetchData()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEstadoChange = async (tarea, nuevoEstado) => {
    try {
      await fetch(`/api/tareas/${tarea.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ estado: nuevoEstado }),
      })
      fetchData()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const resetForm = () => {
    titulo.setValue('')
    descripcion.setValue('')
    setFormData({
      titulo: '',
      descripcion: '',
      prioridad: 'Media',
      asignadoAId: '',
      fechaLimite: '',
      estado: 'Pendiente',
    })
  }

  const getPrioridadConfig = (prioridad) => prioridades.find(p => p.value === prioridad) || prioridades[2]
  const getEstadoConfig = (estado) => estados.find(e => e.value === estado) || estados[0]

  const isOverdue = (tarea) => {
    if (tarea.fechaLimite && tarea.estado !== 'Completada' && tarea.estado !== 'Cancelada') {
      return new Date(tarea.fechaLimite) < new Date()
    }
    return false
  }

  const getDiasRestantes = (tarea) => {
    if (!tarea.fechaLimite) return null
    const hoy = new Date()
    const limite = new Date(tarea.fechaLimite)
    const diff = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24))
    return diff
  }

  const tareasOrdenadas = [...tareas].sort((a, b) => {
    const ordenPrioridad = { Urgente: 0, Alta: 1, Media: 2, Baja: 3 }
    return ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad]
  })

  return (
    <CRUDBase title="Tareas" subtitle="Gestión de tareas y pendientes">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400/50"
          >
            <option value="">Todos los estados</option>
            {estados.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
          </select>

          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400/50"
          >
            <option value="">Todas las prioridades</option>
            {prioridades.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={misTareas}
              onChange={(e) => setMisTareas(e.target.checked)}
              className="w-4 h-4 rounded border-green-500/30 bg-slate-800 text-green-500"
            />
            <span className="text-sm text-green-300">Mis tareas</span>
          </label>
        </div>

        {overdueCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-lg">
            <AlertTriangle size={16} className="text-red-400" />
            <span className="text-sm text-red-400">{overdueCount} tarea{overdueCount > 1 ? 's' : ''} vencida{overdueCount > 1 ? 's' : ''}</span>
          </div>
        )}

        <Button onClick={() => { resetForm(); setEditData(null); setModalOpen(true) }}>
          <span className="flex items-center gap-2">
            <Plus size={18} /> Nueva Tarea
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tareasOrdenadas.map((tarea) => {
            const prioridad = getPrioridadConfig(tarea.prioridad)
            const estado = getEstadoConfig(tarea.estado)
            const vencida = isOverdue(tarea)
            const diasRestantes = getDiasRestantes(tarea)

            return (
              <div
                key={tarea.id}
                className={`relative p-4 bg-slate-800/50 border rounded-lg hover:border-green-500/30 transition-all ${vencida ? 'border-red-500/50' : prioridad.border}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${prioridad.bg} ${prioridad.color}`}>
                    <Flag size={12} className="inline mr-1" />
                    {prioridad.label}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(tarea)}
                      className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
                      title="Editar"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(tarea)}
                      className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="text-white font-medium mb-2 line-clamp-2">{tarea.titulo}</h3>

                {tarea.descripcion && (
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">{tarea.descripcion}</p>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs ${estado.bg} ${estado.color}`}>
                    {estado.label}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  {tarea.asignadoA && (
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>{tarea.asignadoA.nombre} {tarea.asignadoA.apellido}</span>
                    </div>
                  )}
                  {tarea.fechaLimite && (
                    <div className={`flex items-center gap-1 ${vencida ? 'text-red-400' : ''}`}>
                      <Calendar size={12} />
                      <span>
                        {vencida ? 'Vencida' : diasRestantes !== null && diasRestantes >= 0 ? `${diasRestantes}d` : 'Sin plazo'}
                      </span>
                    </div>
                  )}
                </div>

                {tarea.estado !== 'Completada' && tarea.estado !== 'Cancelada' && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <select
                      value={tarea.estado}
                      onChange={(e) => handleEstadoChange(tarea, e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-700/50 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-green-500/30"
                    >
                      {estados.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                    </select>
                  </div>
                )}
              </div>
            )
          })}

          {tareas.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400">
              <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>No hay tareas</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Editar Tarea' : 'Nueva Tarea'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Título" {...titulo} required placeholder="TÍTULO DE LA TAREA..." />

          <Input label="Descripción" type="textarea" {...descripcion} placeholder="DESCRIPCIÓN OPCIONAL..." />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-xs md:text-sm font-medium text-green-300/90">Prioridad</label>
              <select
                value={formData.prioridad}
                onChange={(e) => setFormData({...formData, prioridad: e.target.value})}
                className="w-full px-3 py-2 bg-slate-800/50 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400/50"
              >
                {prioridades.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            <Input
              label="Fecha Límite"
              type="date"
              value={formData.fechaLimite}
              onChange={(e) => setFormData({...formData, fechaLimite: e.target.value})}
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs md:text-sm font-medium text-green-300/90">Asignar a</label>
            <select
              value={formData.asignadoAId}
              onChange={(e) => setFormData({...formData, asignadoAId: e.target.value})}
              className="w-full px-3 py-2 bg-slate-800/50 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400/50"
            >
              <option value="">Sin asignar</option>
              {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre} {u.apellido}</option>)}
            </select>
          </div>

          {editData && (
            <div>
              <label className="block mb-1.5 text-xs md:text-sm font-medium text-green-300/90">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
                className="w-full px-3 py-2 bg-slate-800/50 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400/50"
              >
                {estados.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editData ? 'Actualizar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>
    </CRUDBase>
  )
}
