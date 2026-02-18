'use client'

import { useState, useEffect, useRef } from 'react'
import CRUDBase, { DataTable, Modal, Button, Input, useUpperCase } from '@/components/CRUDBase'
import { Plus, Eye, CheckCircle, Clock, XCircle, Upload, File, Trash2, Image, FileText, Download, Maximize2, X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Paperclip, AlertOctagon } from 'lucide-react'

const estadosTicket = [
  { value: 'Abierto', label: 'Abierto' },
  { value: 'EnProceso', label: 'En Proceso' },
  { value: 'Resuelto', label: 'Resuelto' },
  { value: 'Cerrado', label: 'Cerrado' },
]

const prioridades = [
  { value: 'Baja', label: 'Baja' },
  { value: 'Media', label: 'Media' },
  { value: 'Alta', label: 'Alta' },
  { value: 'Critica', label: 'Crítica' },
]

export default function TicketsPage() {
  const [tickets, setTickets] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [equipos, setEquipos] = useState([])
  const [ubicaciones, setUbicaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false)
  const [selectedEvidence, setSelectedEvidence] = useState([])
  const [fullscreenImage, setFullscreenImage] = useState(null)
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const [editData, setEditData] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef = useRef(null)

  const titulo = useUpperCase('')
  const descripcion = useUpperCase('')
  const observaciones = useUpperCase('')

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    estado: 'Abierto',
    prioridad: 'Media',
    ubicacionId: '',
    asignadoAId: '',
    equipoId: '',
    observaciones: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [ticketsRes, tecnicosRes, equiposRes, ubicacionesRes] = await Promise.all([
        fetch('/api/tickets', { credentials: 'include' }),
        fetch('/api/auth/tecnicos', { credentials: 'include' }),
        fetch('/api/equipos/computo', { credentials: 'include' }),
        fetch('/api/ubicaciones', { credentials: 'include' }),
      ])
      
      if (ticketsRes.ok) setTickets(await ticketsRes.json())
      if (tecnicosRes.ok) setTecnicos(await tecnicosRes.json())
      if (equiposRes.ok) setEquipos(await equiposRes.json())
      if (ubicacionesRes.ok) setUbicaciones(await ubicacionesRes.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editData ? `/api/tickets/${editData.id}` : '/api/tickets'
      const method = editData ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: titulo.value,
          descripcion: descripcion.value,
          estado: formData.estado,
          prioridad: formData.prioridad,
          asignadoAId: formData.asignadoAId || null,
          equipoId: formData.equipoId || null,
          observaciones: observaciones.value,
        }),
      })

      if (res.ok) {
        const ticket = await res.json()
        
        if (selectedFiles.length > 0) {
          for (const file of selectedFiles) {
            const formDataFile = new FormData()
            formDataFile.append('file', file)
            formDataFile.append('ticketId', ticket.id)
            await fetch('/api/evidencias', { credentials: 'include', 
              method: 'POST',
              body: formDataFile,
            })
          }
        }

        setModalOpen(false)
        setEditData(null)
        setSelectedFiles([])
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

  const handleView = async (ticket) => {
    try {
      const res = await fetch(`/api/tickets/${ticket.id}`)
      if (res.ok) {
        setSelectedTicket(await res.json())
        setViewModalOpen(true)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (ticket) => {
    setEditData(ticket)
    titulo.setValue(ticket.titulo)
    descripcion.setValue(ticket.descripcion)
    observaciones.setValue(ticket.observaciones || '')
    setFormData({
      titulo: ticket.titulo,
      descripcion: ticket.descripcion,
      estado: ticket.estado,
      prioridad: ticket.prioridad,
      ubicacionId: ticket.ubicacionId || '',
      asignadoAId: ticket.asignadoAId || '',
      equipoId: ticket.equipoId || '',
      observaciones: ticket.observaciones || '',
    })
    setModalOpen(true)
  }

  const handleDelete = async (ticket) => {
    if (!confirm(`¿Eliminar ticket "${ticket.titulo}"?`)) return
    
    try {
      const res = await fetch(`/api/tickets/${ticket.id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchData()
      } else {
        alert('Error al eliminar')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUploadEvidence = async (ticketId) => {
    if (selectedFiles.length === 0) return
    
    setUploading(true)
    try {
      for (const file of selectedFiles) {
        const formDataFile = new FormData()
        formDataFile.append('file', file)
        formDataFile.append('ticketId', ticketId)
        await fetch('/api/evidencias', { credentials: 'include', 
          method: 'POST',
          body: formDataFile,
        })
      }
      setSelectedFiles([])
      handleView({ id: ticketId })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteEvidence = async (evidenceId) => {
    if (!confirm('¿Eliminar esta evidencia?')) return
    
    try {
      const res = await fetch(`/api/evidencias/${evidenceId}`, { method: 'DELETE' })
      if (res.ok) {
        handleView({ id: selectedTicket.id })
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const resetForm = () => {
    titulo.setValue('')
    descripcion.setValue('')
    observaciones.setValue('')
    setFormData({
      titulo: '',
      descripcion: '',
      estado: 'Abierto',
      prioridad: 'Media',
      asignadoAId: '',
      equipoId: '',
      observaciones: '',
    })
  }

  const getEstadoBadge = (estado) => {
    const config = {
      Abierto: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: AlertOctagon, bg: 'bg-red-500' },
      EnProceso: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock, bg: 'bg-yellow-500' },
      Resuelto: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: CheckCircle, bg: 'bg-blue-500' },
      Cerrado: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: XCircle, bg: 'bg-green-500' },
    }
    const labels = { Abierto: 'Abierto', EnProceso: 'En Proceso', Resuelto: 'Resuelto', Cerrado: 'Cerrado' }
    if (!config[estado]) return <span className="text-slate-400">-</span>
    const { icon: Icon, bg } = config[estado]
    return (
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${bg} animate-pulse`}></span>
        <span className={`px-2 py-1 rounded-full text-xs border flex items-center gap-1 ${config[estado].color}`}>
          <Icon size={12} /> {labels[estado]}
        </span>
      </div>
    )
  }

  const getPrioridadBadge = (prioridad) => {
    const config = {
      Baja: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      Media: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      Alta: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      Critica: 'bg-red-500/20 text-red-400 border-red-500/30',
    }
    const labels = { Baja: 'Baja', Media: 'Media', Alta: 'Alta', Critica: 'Crítica' }
    return <span className={`px-2 py-1 rounded-full text-xs border ${config[prioridad]}`}>{labels[prioridad]}</span>
  }

  const columns = [
    { key: 'titulo', header: 'Título' },
    { key: 'estado', header: 'Estado', render: (val) => getEstadoBadge(val) },
    { key: 'prioridad', header: 'Prioridad', render: (val) => getPrioridadBadge(val) },
    { key: 'creadoPor', header: 'Creado por', render: (val) => val ? `${val.nombre} ${val.apellido}` : '-' },
    { key: 'asignadoA', header: 'Técnico', render: (val) => val ? `${val.nombre} ${val.apellido}` : '-' },
    { key: 'createdAt', header: 'Fecha Creación', render: (val) => val ? new Date(val).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-' },
    { key: 'fechaCierre', header: 'Fecha Cierre', render: (val) => val ? new Date(val).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-' },
    { 
      key: 'evidencias', 
      header: 'Evidencias', 
      render: (val, row) => val?.length > 0 ? (
        <button 
          onClick={(e) => { e.stopPropagation(); setSelectedEvidence(val); setSelectedTicketId(row.id); setEvidenceModalOpen(true) }}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 hover:text-green-300 transition-all"
        >
          <Paperclip size={14} />
          <span className="text-xs font-medium">{val.length}</span>
        </button>
      ) : (
        <button 
          onClick={(e) => { e.stopPropagation(); setSelectedEvidence([]); setSelectedTicketId(row.id); setEvidenceModalOpen(true) }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-500 hover:text-green-400 hover:bg-green-500/10 transition-all text-xs"
        >
          <Paperclip size={14} />
          <span>0</span>
        </button>
      )
    },
  ]

  return (
    <CRUDBase title="Tickets" subtitle="Gestión de tickets de soporte técnico">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => { resetForm(); setEditData(null); setModalOpen(true) }}>
          <span className="flex items-center gap-2">
            <Plus size={18} /> Nuevo Ticket
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
          data={tickets} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          searchFields={['titulo', 'descripcion', 'estado', 'prioridad']}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Editar Ticket' : 'Nuevo Ticket'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Título" {...titulo} required placeholder="TÍTULO DEL TICKET" />
          
          <div>
            <label className="block mb-1.5 md:mb-2 text-xs md:text-sm font-medium text-green-300/90">Descripción</label>
            <textarea
              value={descripcion.value}
              onChange={descripcion.onChange}
              rows={3}
              className="w-full px-3 py-2 md:py-2.5 bg-slate-800/50 border border-green-500/30 rounded-lg text-white text-sm md:text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 uppercase"
              placeholder="DESCRIPCIÓN DEL PROBLEMA..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Estado" type="select" value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} options={estadosTicket} />
            <Input label="Prioridad" type="select" value={formData.prioridad} onChange={(e) => setFormData({...formData, prioridad: e.target.value})} options={prioridades} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Asignar a Técnico" 
              type="select" 
              value={formData.asignadoAId} 
              onChange={(e) => setFormData({...formData, asignadoAId: e.target.value})} 
              options={[{ value: '', label: 'Sin asignar' }, ...tecnicos.map(t => ({ value: t.id, label: `${t.nombre} ${t.apellido}` }))]} 
            />
            <Input 
              label="Equipo Relacionado" 
              type="select" 
              value={formData.equipoId} 
              onChange={(e) => setFormData({...formData, equipoId: e.target.value})} 
              options={[{ value: '', label: 'Sin equipo' }, ...equipos.map(e => ({ value: e.id, label: `${e.serial} - ${e.marca} ${e.modelo}` }))]} 
            />
          </div>

          <Input label="Observaciones" type="textarea" {...observaciones} placeholder="OBSERVACIONES ADICIONALES..." />

          {editData && (
            <div>
              <label className="block mb-1.5 md:mb-2 text-xs md:text-sm font-medium text-green-300/90">Agregar Evidencias</label>
              <div className="border-2 border-dashed border-green-500/30 rounded-lg p-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  accept="image/jpeg,image/jpg,image/png,.pdf"
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="text-green-400" size={24} />
                  <p className="text-slate-400 text-sm">Arrastra archivos o haz clic para seleccionar</p>
                  <Button type="button" onClick={() => fileInputRef.current?.click()}>Seleccionar Archivos</Button>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2">
                        <span className="text-white text-sm truncate">{file.name}</span>
                        <button type="button" onClick={() => removeFile(index)} className="text-red-400 hover:text-red-300">
                          <XCircle size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editData ? 'Actualizar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Detalle del Ticket" size="lg">
        {selectedTicket && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-green-400/70">Estado</p>
                {getEstadoBadge(selectedTicket.estado)}
              </div>
              <div>
                <p className="text-xs text-green-400/70">Prioridad</p>
                {getPrioridadBadge(selectedTicket.prioridad)}
              </div>
            </div>
            <div>
              <p className="text-xs text-green-400/70">Título</p>
              <p className="text-white font-medium">{selectedTicket.titulo}</p>
            </div>
            <div>
              <p className="text-xs text-green-400/70">Descripción</p>
              <p className="text-slate-300">{selectedTicket.descripcion}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-green-400/70">Creado por</p>
                <p className="text-white">{selectedTicket.creadoPor?.nombre} {selectedTicket.creadoPor?.apellido}</p>
              </div>
              <div>
                <p className="text-xs text-green-400/70">Asignado a</p>
                <p className="text-white">{selectedTicket.asignadoA ? `${selectedTicket.asignadoA.nombre} ${selectedTicket.asignadoA.apellido}` : 'Sin asignar'}</p>
              </div>
            </div>
            {selectedTicket.equipoComputo && (
              <div>
                <p className="text-xs text-green-400/70">Equipo</p>
                <p className="text-white">{selectedTicket.equipoComputo.serial} - {selectedTicket.equipoComputo.marca} {selectedTicket.equipoComputo.modelo}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-green-400/70 mb-2">Evidencias</p>
              <div className="border border-green-500/30 rounded-lg p-4 space-y-3">
                {selectedTicket.evidencias?.length > 0 ? (
                  selectedTicket.evidencias.map((ev) => (
                    <div key={ev.id} className="bg-slate-800/50 rounded-lg overflow-hidden">
                      {ev.tipoArchivo === 'imagen' ? (
                        <div className="relative">
                          <img 
                            src={ev.urlArchivo} 
                            alt={ev.nombreArchivo}
                            className="w-full h-48 object-contain bg-slate-900"
                          />
                          <button 
                            onClick={() => handleDeleteEvidence(ev.id)} 
                            className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-lg text-white hover:bg-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-white">
                              <FileText size={24} className="text-red-400" />
                              <span className="text-sm truncate">{ev.nombreArchivo}</span>
                            </div>
                            <button onClick={() => handleDeleteEvidence(ev.id)} className="text-red-400 hover:text-red-300">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <a 
                            href={ev.urlArchivo} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block text-center py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 text-sm"
                          >
                            Ver PDF
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm text-center">No hay evidencias</p>
                )}
              </div>
              <div className="mt-2">
                <input
                  type="file"
                  id="evidence-upload"
                  onChange={handleFileSelect}
                  multiple
                  accept="image/jpeg,image/jpg,image/png,.pdf"
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <Button type="button" onClick={() => document.getElementById('evidence-upload')?.click()} className="text-xs">
                    <Upload size={14} className="mr-1" /> Subir Evidencia
                  </Button>
                  {selectedFiles.length > 0 && (
                    <Button type="button" onClick={() => handleUploadEvidence(selectedTicket.id)} disabled={uploading}>
                      {uploading ? 'Subiendo...' : `Guardar ${selectedFiles.length} archivo(s)`}
                    </Button>
                  )}
                </div>
                {selectedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-800/50 rounded px-2 py-1">
                        <span className="text-white text-xs truncate">{file.name}</span>
                        <button type="button" onClick={() => removeFile(index)} className="text-red-400">
                          <XCircle size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setViewModalOpen(false)}>Cerrar</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={evidenceModalOpen} onClose={() => { setEvidenceModalOpen(false); setSelectedEvidence([]); setSelectedTicketId(null) }} title="Gestión de Evidencias" size="3xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-400 text-sm">
              {selectedEvidence.length} archivo(s) adjunto(s)
            </p>
            <label className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-slate-900 font-medium rounded-lg cursor-pointer transition-all">
              <Upload size={16} />
              Subir Evidencia
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,.pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-green-500/20">
              <p className="text-green-400 text-sm mb-2">Archivos pendientes por subir:</p>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-900/50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      {file.type.includes('pdf') ? (
                        <FileText size={16} className="text-red-400" />
                      ) : (
                        <Image size={16} className="text-green-400" />
                      )}
                      <span className="text-white text-sm truncate max-w-[200px]">{file.name}</span>
                    </div>
                    <button onClick={() => removeFile(index)} className="text-red-400 hover:text-red-300">
                      <XCircle size={18} />
                    </button>
                  </div>
                ))}
              </div>
              {selectedTicketId && (
                <button
                  onClick={() => handleUploadEvidence(selectedTicketId)}
                  disabled={uploading}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg transition-all disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Subir {selectedFiles.length} archivo(s)
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {selectedEvidence.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto pr-2">
              {selectedEvidence.map((ev) => (
                <div 
                  key={ev.id} 
                  className="group relative bg-slate-800/50 rounded-xl overflow-hidden border border-green-500/20 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10"
                >
                  {ev.tipoArchivo === 'imagen' ? (
                    <div 
                      className="relative aspect-square cursor-pointer"
                      onClick={() => setFullscreenImage(ev)}
                    >
                      <img 
                        src={ev.urlArchivo} 
                        alt={ev.nombreArchivo}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => setFullscreenImage(ev)}
                            className="p-2 bg-green-500/20 hover:bg-green-500/40 rounded-lg text-green-400 transition-colors"
                          >
                            <Maximize2 size={14} />
                          </button>
                          <a 
                            href={ev.urlArchivo} 
                            download={ev.nombreArchivo}
                            className="p-2 bg-green-500/20 hover:bg-green-500/40 rounded-lg text-green-400 transition-colors"
                          >
                            <Download size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square flex flex-col items-center justify-center p-4 bg-slate-900/50">
                      <FileText size={40} className="text-red-400 mb-2" />
                      <p className="text-white text-xs text-center truncate w-full">{ev.nombreArchivo}</p>
                      <div className="flex gap-1 mt-2">
                        <a 
                          href={ev.urlArchivo} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 bg-green-500/20 hover:bg-green-500/40 rounded-lg text-green-400 transition-colors"
                        >
                          <Eye size={14} />
                        </a>
                        <a 
                          href={ev.urlArchivo} 
                          download={ev.nombreArchivo}
                          className="p-2 bg-green-500/20 hover:bg-green-500/40 rounded-lg text-green-400 transition-colors"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => handleDeleteEvidence(ev.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                <Paperclip size={32} className="text-slate-500" />
              </div>
              <p className="text-slate-400 text-lg mb-2">No hay evidencias</p>
              <p className="text-slate-500 text-sm">Sube imágenes o PDFs para documentar el ticket</p>
            </div>
          )}
          
          <div className="flex justify-end pt-4 border-t border-green-500/20">
            <Button onClick={() => { setEvidenceModalOpen(false); setSelectedEvidence([]); setSelectedTicketId(null) }}>Cerrar</Button>
          </div>
        </div>
      </Modal>

      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center">
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 rounded-lg text-white transition-colors z-10"
          >
            <X size={24} />
          </button>
          
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="text-green-400 text-sm font-medium">Vista completa</span>
          </div>
          
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img 
              src={fullscreenImage.urlArchivo} 
              alt={fullscreenImage.nombreArchivo}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl shadow-green-500/20"
            />
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <a 
                href={fullscreenImage.urlArchivo} 
                download={fullscreenImage.nombreArchivo}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-slate-900 font-medium rounded-lg transition-colors"
              >
                <Download size={18} />
                Descargar
              </a>
            </div>
          </div>
        </div>
      )}
    </CRUDBase>
  )
}
