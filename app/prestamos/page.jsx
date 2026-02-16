'use client'

import { useState, useEffect } from 'react'
import CRUDBase, { DataTable, Modal, Button, Input, useUpperCase } from '@/components/CRUDBase'
import { Plus, CheckCircle, Clock, XCircle, Search, Monitor, Mouse, Tv } from 'lucide-react'

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
  const [funcionarios, setFuncionarios] = useState([])
  const [audiovisuales, setAudiovisuales] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  
  const [searchFuncionario, setSearchFuncionario] = useState('')
  const [showFuncionarioList, setShowFuncionarioList] = useState(false)
  const [searchEquipo, setSearchEquipo] = useState('')
  const [showEquipoList, setShowEquipoList] = useState(false)
  const [searchPeriferico, setSearchPeriferico] = useState('')
  const [showPerifericoList, setShowPerifericoList] = useState(false)
  const [searchAudiovisual, setSearchAudiovisual] = useState('')
  const [showAudiovisualList, setShowAudiovisualList] = useState(false)

  const observaciones = useUpperCase('')

  const [checklist, setChecklist] = useState({
    bolso: false,
    cargador: false,
    memoriaSd: false,
    guaya: false,
    padMouse: false,
    mouse: false,
  })

  const [formData, setFormData] = useState({
    usuarioId: '',
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
      const [prestamosRes, funcionariosRes, equiposRes, perifericosRes, audiovisualesRes] = await Promise.all([
        fetch('/api/prestamos', { credentials: 'include' }),
        fetch('/api/funcionarios', { credentials: 'include' }),
        fetch('/api/equipos/computo', { credentials: 'include' }),
        fetch('/api/perifericos', { credentials: 'include' }),
        fetch('/api/audiovisuales', { credentials: 'include' }),
      ])
      
      if (prestamosRes.ok) setPrestamos(await prestamosRes.json())
      if (funcionariosRes.ok) setFuncionarios(await funcionariosRes.json())
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
        credentials: 'include',
        body: JSON.stringify({
          usuarioId: formData.usuarioId,
          equipoComputoId: formData.equipoComputoId || null,
          perifericoId: formData.perifericoId || null,
          audiovisualId: formData.audiovisualId || null,
          fechaPrestamo: formData.fechaPrestamo,
          fechaDevolucion: formData.fechaDevolucion || null,
          estado: formData.estado,
          observaciones: observaciones.value,
          ...checklist,
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

  const selectFuncionario = (func) => {
    setFormData({...formData, usuarioId: func.id})
    setSearchFuncionario(`${func.nombre} ${func.apellido}`)
    setShowFuncionarioList(false)
  }

  const selectEquipo = (eq) => {
    setFormData({...formData, equipoComputoId: eq.id, perifericoId: '', audiovisualId: ''})
    setSearchEquipo(`${eq.marca} ${eq.modelo} - ${eq.serial}`)
    setShowEquipoList(false)
    setChecklist({ bolso: false, cargador: false, memoriaSd: false, guaya: false, padMouse: false, mouse: false })
  }

  const selectPeriferico = (per) => {
    setFormData({...formData, perifericoId: per.id, equipoComputoId: '', audiovisualId: ''})
    setSearchPeriferico(`${per.marca} ${per.tipo} - ${per.serial || 'Sin serial'}`)
    setShowPerifericoList(false)
    setSearchEquipo('')
    setSearchAudiovisual('')
    setChecklist({ bolso: false, cargador: false, memoriaSd: false, guaya: false, padMouse: false, mouse: false })
  }

  const selectAudiovisual = (aud) => {
    setFormData({...formData, audiovisualId: aud.id, equipoComputoId: '', perifericoId: ''})
    setSearchAudiovisual(`${aud.marca} ${aud.tipo} - ${aud.serial}`)
    setShowAudiovisualList(false)
    setSearchEquipo('')
    setSearchPeriferico('')
    setChecklist({ bolso: false, cargador: false, memoriaSd: false, guaya: false, padMouse: false, mouse: false })
  }

  const handleEdit = (prestamo) => {
    setEditData(prestamo)
    observaciones.setValue(prestamo.observaciones || '')
    
    const func = prestamo.usuario
    if (func) {
      setSearchFuncionario(`${func.nombre} ${func.apellido}`)
    }
    if (prestamo.equipoComputo) {
      setSearchEquipo(`${prestamo.equipoComputo.marca} ${prestamo.equipoComputo.modelo} - ${prestamo.equipoComputo.serial}`)
    }
    if (prestamo.periferico) {
      setSearchPeriferico(`${prestamo.periferico.marca} ${prestamo.periferico.tipo} - ${prestamo.periferico.serial || 'Sin serial'}`)
    }
    if (prestamo.audiovisual) {
      setSearchAudiovisual(`${prestamo.audiovisual.marca} ${prestamo.audiovisual.tipo} - ${prestamo.audiovisual.serial}`)
    }

    setChecklist({
      bolso: prestamo.bolso || false,
      cargador: prestamo.cargador || false,
      memoriaSd: prestamo.memoriaSd || false,
      guaya: prestamo.guaya || false,
      padMouse: prestamo.padMouse || false,
      mouse: prestamo.mouse || false,
    })

    setFormData({
      usuarioId: prestamo.usuarioId || '',
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
    setSearchFuncionario('')
    setSearchEquipo('')
    setSearchPeriferico('')
    setSearchAudiovisual('')
    setChecklist({ bolso: false, cargador: false, memoriaSd: false, guaya: false, padMouse: false, mouse: false })
    setFormData({
      usuarioId: '',
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
    const { icon: Icon } = config[estado] || config.Pendiente
    return (
      <span className={`px-2 py-1 rounded-full text-xs border flex items-center gap-1 w-fit ${config[estado]?.color || 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
        <Icon size={12} /> {labels[estado] || estado}
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

  const filteredFuncionarios = searchFuncionario 
    ? funcionarios.filter(f => 
        `${f.nombre} ${f.apellido}`.toLowerCase().includes(searchFuncionario.toLowerCase()) ||
        f.cedula?.includes(searchFuncionario)
      )
    : funcionarios

  const filteredEquipos = searchEquipo 
    ? equipos.filter(e => 
        e.marca?.toLowerCase().includes(searchEquipo.toLowerCase()) ||
        e.modelo?.toLowerCase().includes(searchEquipo.toLowerCase()) ||
        e.serial?.toLowerCase().includes(searchEquipo.toLowerCase())
      )
    : equipos

  const filteredPerifericos = searchPeriferico 
    ? perifericos.filter(p => 
        p.marca?.toLowerCase().includes(searchPeriferico.toLowerCase()) ||
        p.tipo?.toLowerCase().includes(searchPeriferico.toLowerCase()) ||
        p.serial?.toLowerCase().includes(searchPeriferico.toLowerCase())
      )
    : perifericos

  const filteredAudiovisuales = searchAudiovisual 
    ? audiovisuales.filter(a => 
        a.marca?.toLowerCase().includes(searchAudiovisual.toLowerCase()) ||
        a.tipo?.toLowerCase().includes(searchAudiovisual.toLowerCase()) ||
        a.serial?.toLowerCase().includes(searchAudiovisual.toLowerCase())
      )
    : audiovisuales

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
          <div className="relative">
            <label className="block mb-1.5 md:mb-2 text-xs md:text-sm font-medium text-green-300/90">Funcionario</label>
            <div className="relative">
              <input
                type="text"
                value={searchFuncionario}
                onChange={(e) => {
                  setSearchFuncionario(e.target.value)
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <label className="block mb-1.5 md:mb-2 text-xs md:text-sm font-medium text-green-300/90">
                <span className="flex items-center gap-1"><Monitor size={14} /> Equipo Cómputo</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchEquipo}
                  onChange={(e) => {
                    setSearchEquipo(e.target.value)
                    setShowEquipoList(true)
                    if (e.target.value === '') {
                      setFormData({...formData, equipoComputoId: ''})
                      setChecklist({ bolso: false, cargador: false, memoriaSd: false, guaya: false, padMouse: false, mouse: false })
                    }
                  }}
                  onFocus={() => setShowEquipoList(true)}
                  placeholder="BUSCAR EQUIPO..."
                  className="w-full px-3 py-2 md:py-2.5 bg-slate-800/50 border border-green-500/30 rounded-lg text-white text-sm md:text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 uppercase"
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
              
              {showEquipoList && filteredEquipos.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-green-500/30 rounded-lg max-h-48 overflow-y-auto">
                  {filteredEquipos.slice(0, 8).map((eq) => (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => selectEquipo(eq)}
                      className="w-full text-left px-3 py-2 text-white hover:bg-slate-700 border-b border-green-500/10 last:border-0"
                    >
                      <p className="text-sm font-medium">{eq.marca} {eq.modelo}</p>
                      <p className="text-xs text-slate-400">{eq.serial}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block mb-1.5 md:mb-2 text-xs md:text-sm font-medium text-green-300/90">
                <span className="flex items-center gap-1"><Mouse size={14} /> Periférico</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchPeriferico}
                  onChange={(e) => {
                    setSearchPeriferico(e.target.value)
                    setShowPerifericoList(true)
                  }}
                  onFocus={() => setShowPerifericoList(true)}
                  placeholder="BUSCAR PERIFÉRICO..."
                  className="w-full px-3 py-2 md:py-2.5 bg-slate-800/50 border border-green-500/30 rounded-lg text-white text-sm md:text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 uppercase"
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
              
              {showPerifericoList && filteredPerifericos.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-green-500/30 rounded-lg max-h-48 overflow-y-auto">
                  {filteredPerifericos.slice(0, 8).map((per) => (
                    <button
                      key={per.id}
                      type="button"
                      onClick={() => selectPeriferico(per)}
                      className="w-full text-left px-3 py-2 text-white hover:bg-slate-700 border-b border-green-500/10 last:border-0"
                    >
                      <p className="text-sm font-medium">{per.marca} {per.tipo}</p>
                      <p className="text-xs text-slate-400">{per.serial || 'Sin serial'}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block mb-1.5 md:mb-2 text-xs md:text-sm font-medium text-green-300/90">
                <span className="flex items-center gap-1"><Tv size={14} /> Audiovisual</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchAudiovisual}
                  onChange={(e) => {
                    setSearchAudiovisual(e.target.value)
                    setShowAudiovisualList(true)
                  }}
                  onFocus={() => setShowAudiovisualList(true)}
                  placeholder="BUSCAR AUDIOVISUAL..."
                  className="w-full px-3 py-2 md:py-2.5 bg-slate-800/50 border border-green-500/30 rounded-lg text-white text-sm md:text-base placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50 uppercase"
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
              
              {showAudiovisualList && filteredAudiovisuales.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-green-500/30 rounded-lg max-h-48 overflow-y-auto">
                  {filteredAudiovisuales.slice(0, 8).map((aud) => (
                    <button
                      key={aud.id}
                      type="button"
                      onClick={() => selectAudiovisual(aud)}
                      className="w-full text-left px-3 py-2 text-white hover:bg-slate-700 border-b border-green-500/10 last:border-0"
                    >
                      <p className="text-sm font-medium">{aud.marca} {aud.tipo}</p>
                      <p className="text-xs text-slate-400">{aud.serial}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {formData.equipoComputoId && (
            <div className="bg-slate-800/50 border border-green-500/30 rounded-lg p-4">
              <label className="block mb-3 text-sm font-medium text-green-300/90">Accesorios del Equipo</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: 'bolso', label: 'Bolso' },
                  { key: 'cargador', label: 'Cargador' },
                  { key: 'memoriaSd', label: 'Memoria SD' },
                  { key: 'guaya', label: 'Guaya' },
                  { key: 'padMouse', label: 'Pad Mouse' },
                  { key: 'mouse', label: 'Mouse' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist[item.key]}
                      onChange={(e) => setChecklist({...checklist, [item.key]: e.target.checked})}
                      className="w-4 h-4 rounded border-green-500/30 bg-slate-800 text-green-500 focus:ring-green-400/50"
                    />
                    <span className="text-sm text-white">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

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
