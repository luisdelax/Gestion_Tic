'use client'

import { useState, useEffect } from 'react'
import CRUDBase, { DataTable, Modal, Button, Input, useUpperCase } from '@/components/CRUDBase'
import { Plus } from 'lucide-react'

const tiposTelecom = [
  { value: 'Switch', label: 'Switch' },
  { value: 'Router', label: 'Router' },
  { value: 'AccessPoint', label: 'Access Point' },
  { value: 'Modem', label: 'Módem' },
  { value: 'TelefonoIP', label: 'Teléfono IP' },
  { value: 'CableRed', label: 'Cable de Red' },
  { value: 'PatchPanel', label: 'Patch Panel' },
  { value: 'FibraOptica', label: 'Fibra Óptica' },
]

const estadosEquipo = [
  { value: 'Disponible', label: 'Disponible' },
  { value: 'Asignado', label: 'Asignado' },
  { value: 'EnReparacion', label: 'En Reparación' },
  { value: 'DadoDeBaja', label: 'Dado de Baja' },
]

export default function EquiposTelecomPage() {
  const [equipos, setEquipos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  const marca = useUpperCase('')
  const modelo = useUpperCase('')
  const serial = useUpperCase('')
  const mac = useUpperCase('')
  const ip = useUpperCase('')
  const ubicacion = useUpperCase('')
  const dependencia = useUpperCase('')
  const observaciones = useUpperCase('')

  const [formData, setFormData] = useState({
    tipo: '',
    marca: '',
    modelo: '',
    serial: '',
    mac: '',
    ip: '',
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
      const res = await fetch('/api/equipos/telecom')
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
      const url = editData ? `/api/equipos/telecom/${editData.id}` : '/api/equipos/telecom'
      const method = editData ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: formData.tipo,
          marca: marca.value,
          modelo: modelo.value,
          serial: serial.value,
          mac: mac.value.toUpperCase(),
          ip: ip.value,
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
    marca.setValue(equipo.marca)
    modelo.setValue(equipo.modelo)
    serial.setValue(equipo.serial)
    mac.setValue(equipo.mac || '')
    ip.setValue(equipo.ip || '')
    ubicacion.setValue(equipo.ubicacion || '')
    dependencia.setValue(equipo.dependencia || '')
    observaciones.setValue(equipo.observaciones || '')
    setFormData({
      tipo: equipo.tipo,
      estado: equipo.estado,
      fechaAdquisicion: equipo.fechaAdquisicion?.split('T')[0] || '',
    })
    setModalOpen(true)
  }

  const handleDelete = async (equipo) => {
    if (!confirm(`¿Eliminar equipo ${equipo.serial}?`)) return
    
    try {
      const res = await fetch(`/api/equipos/telecom/${equipo.id}`, { method: 'DELETE' })
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
    marca.setValue('')
    modelo.setValue('')
    serial.setValue('')
    mac.setValue('')
    ip.setValue('')
    ubicacion.setValue('')
    dependencia.setValue('')
    observaciones.setValue('')
    setFormData({
      tipo: '',
      marca: '',
      modelo: '',
      serial: '',
      mac: '',
      ip: '',
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
      Switch: 'Switch',
      Router: 'Router',
      AccessPoint: 'Access Point',
      Modem: 'Módem',
      TelefonoIP: 'Teléfono IP',
      CableRed: 'Cable de Red',
      PatchPanel: 'Patch Panel',
      FibraOptica: 'Fibra Óptica',
    }
    return labels[tipo] || tipo
  }

  const columns = [
    { key: 'serial', header: 'Serial' },
    { key: 'tipo', header: 'Tipo', render: (val) => getTipoLabel(val) },
    { key: 'marca', header: 'Marca' },
    { key: 'modelo', header: 'Modelo' },
    { key: 'ip', header: 'IP' },
    { key: 'estado', header: 'Estado', render: (val) => getEstadoBadge(val) },
    { key: 'ubicacion', header: 'Ubicación' },
  ]

  return (
    <CRUDBase title="Equipos de Telecomunicaciones" subtitle="Gestión de infraestructura de red">
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
          searchFields={['serial', 'tipo', 'marca', 'modelo', 'ip', 'ubicacion']}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Editar Equipo' : 'Nuevo Equipo'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Tipo" type="select" value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} options={tiposTelecom} />
            <Input label="Estado" type="select" value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} options={estadosEquipo} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Marca" {...marca} required placeholder="CISCO, TP-LINK..." />
            <Input label="Modelo" {...modelo} required placeholder="WS-C2960X" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Serial" {...serial} required placeholder="SN123456" />
            <Input label="MAC" {...mac} placeholder="00:1A:2B:3C:4D:5E" />
          </div>
          <Input label="Dirección IP" {...ip} placeholder="192.168.1.1" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Ubicación" {...ubicacion} placeholder="RACK 1" />
            <Input label="Dependencia" {...dependencia} placeholder="RED" />
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
