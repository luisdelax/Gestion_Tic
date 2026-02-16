'use client'

import { useState, useEffect } from 'react'
import CRUDBase, { DataTable, Modal, Button, Input, useUpperCase } from '@/components/CRUDBase'
import { Plus } from 'lucide-react'
import { 
  MARCAS_COMPUTADORAS, 
  MODELOS_POR_MARCA, 
  OPCIONES_RAM, 
  OPCIONES_DISCO, 
  UNIDADES_ALMACENAMIENTO,
  PROCESADORES
} from '@/lib/constantes'

const tiposEquipo = [
  { value: 'Desktop', label: 'Desktop' },
  { value: 'Laptop', label: 'Laptop' },
  { value: 'Servidor', label: 'Servidor' },
  { value: 'AllInOne', label: 'All in One' },
]

const estadosEquipo = [
  { value: 'Disponible', label: 'Disponible' },
  { value: 'Asignado', label: 'Asignado' },
  { value: 'EnReparacion', label: 'En Reparación' },
  { value: 'DadoDeBaja', label: 'Dado de Baja' },
]

export default function EquiposComputoPage() {
  const [equipos, setEquipos] = useState([])
  const [funcionarios, setFuncionarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  const marca = useUpperCase('')
  const modelo = useUpperCase('')
  const serial = useUpperCase('')
  const mac = useUpperCase('')
  const placa = useUpperCase('')
  const ubicacion = useUpperCase('')
  const dependencia = useUpperCase('')
  const observaciones = useUpperCase('')

  const [formData, setFormData] = useState({
    tipo: '',
    marca: '',
    modelo: '',
    serial: '',
    mac: '',
    placa: '',
    procesador: '',
    ram: '',
    unidadRam: 'GB',
    discoDuro: '',
    unidadDisco: 'GB',
    estado: 'Disponible',
    ubicacion: '',
    dependencia: '',
    fechaAdquisicion: '',
    fechaGarantia: '',
    observaciones: '',
    responsableId: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [eqRes, funcRes] = await Promise.all([
        fetch('/api/equipos/computo', { credentials: 'include' }),
        fetch('/api/funcionarios', { credentials: 'include' })
      ])
      
      if (eqRes.ok) setEquipos(await eqRes.json())
      if (funcRes.ok) setFuncionarios(await funcRes.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editData ? `/api/equipos/computo/${editData.id}` : '/api/equipos/computo'
      const method = editData ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: formData.tipo,
          marca: marca.value,
          modelo: modelo.value,
          serial: serial.value,
          mac: mac.value,
          placa: placa.value || null,
          procesador: formData.procesador,
          ram: formData.ram,
          unidadRam: formData.unidadRam,
          discoDuro: formData.discoDuro,
          unidadDisco: formData.unidadDisco,
          estado: formData.estado,
          ubicacion: ubicacion.value,
          dependencia: dependencia.value,
          fechaAdquisicion: formData.fechaAdquisicion,
          fechaGarantia: formData.fechaGarantia,
          observaciones: observaciones.value,
          responsableId: formData.responsableId || null,
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

  const handleEdit = (equipo) => {
    setEditData(equipo)
    marca.setValue(equipo.marca)
    modelo.setValue(equipo.modelo)
    serial.setValue(equipo.serial)
    mac.setValue(equipo.mac || '')
    placa.setValue(equipo.placa || '')
    ubicacion.setValue(equipo.ubicacion || '')
    dependencia.setValue(equipo.dependencia || '')
    observaciones.setValue(equipo.observaciones || '')
    setFormData({
      tipo: equipo.tipo,
      marca: equipo.marca,
      modelo: equipo.modelo,
      estado: equipo.estado,
      procesador: equipo.procesador || '',
      ram: equipo.ram || '',
      unidadRam: equipo.unidadRam || 'GB',
      discoDuro: equipo.discoDuro || '',
      unidadDisco: equipo.unidadDisco || 'GB',
      fechaAdquisicion: equipo.fechaAdquisicion?.split('T')[0] || '',
      fechaGarantia: equipo.fechaGarantia?.split('T')[0] || '',
      responsableId: equipo.responsableId || '',
    })
    setModalOpen(true)
  }

  const handleDelete = async (equipo) => {
    if (!confirm(`¿Eliminar equipo ${equipo.serial}?`)) return
    
    try {
      const res = await fetch(`/api/equipos/computo/${equipo.id}`, { method: 'DELETE' })
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
    marca.setValue('')
    modelo.setValue('')
    serial.setValue('')
    mac.setValue('')
    placa.setValue('')
    ubicacion.setValue('')
    dependencia.setValue('')
    observaciones.setValue('')
    setFormData({
      tipo: '',
      marca: '',
      modelo: '',
      serial: '',
      mac: '',
      placa: '',
      procesador: '',
      ram: '',
      unidadRam: 'GB',
      discoDuro: '',
      unidadDisco: 'GB',
      estado: 'Disponible',
      ubicacion: '',
      dependencia: '',
      fechaAdquisicion: '',
      fechaGarantia: '',
      observaciones: '',
      responsableId: '',
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

  const columns = [
    { key: 'serial', header: 'Serial' },
    { key: 'placa', header: 'Placa' },
    { key: 'tipo', header: 'Tipo' },
    { key: 'marca', header: 'Marca' },
    { key: 'modelo', header: 'Modelo' },
    { key: 'estado', header: 'Estado', render: (val) => getEstadoBadge(val) },
    { key: 'ubicacion', header: 'Ubicación' },
  ]

  const modelosDisponibles = formData.marca ? MODELOS_POR_MARCA[formData.marca] || [] : []
  const placasRegistradas = equipos.filter(e => e.placa).map(e => e.placa)

  return (
    <CRUDBase title="Equipos de Cómputo" subtitle="Gestión de equipos tecnológicos">
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
          searchFields={['serial', 'placa', 'tipo', 'marca', 'modelo', 'ubicacion']}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Editar Equipo' : 'Nuevo Equipo'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Tipo" type="select" value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} options={tiposEquipo} />
            <Input label="Estado" type="select" value={formData.estado} onChange={(e) => setFormData({...formData, estado: e.target.value})} options={estadosEquipo} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Marca" type="select" value={formData.marca} onChange={(e) => { setFormData({...formData, marca: e.target.value, modelo: ''}); marca.setValue(e.target.value) }} options={MARCAS_COMPUTADORAS} />
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
            <Input label="MAC" {...mac} placeholder="00:1A:2B:3C:4D:5E" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Placa" 
              {...placa} 
              placeholder="PLACA-001" 
            />
            <Input 
              label="Procesador" 
              type="select" 
              value={formData.procesador} 
              onChange={(e) => setFormData({...formData, procesador: e.target.value})} 
              options={PROCESADORES.map(p => ({ value: p, label: p }))} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-2">
              <Input 
                label="RAM" 
                type="select" 
                value={formData.ram} 
                onChange={(e) => setFormData({...formData, ram: e.target.value})} 
                options={OPCIONES_RAM} 
              />
              <Input 
                label="Unidad RAM" 
                type="select" 
                value={formData.unidadRam} 
                onChange={(e) => setFormData({...formData, unidadRam: e.target.value})} 
                options={UNIDADES_ALMACENAMIENTO} 
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input 
                label="Disco Duro" 
                type="select" 
                value={formData.discoDuro} 
                onChange={(e) => setFormData({...formData, discoDuro: e.target.value})} 
                options={OPCIONES_DISCO} 
              />
              <Input 
                label="Unidad Disco" 
                type="select" 
                value={formData.unidadDisco} 
                onChange={(e) => setFormData({...formData, unidadDisco: e.target.value})} 
                options={UNIDADES_ALMACENAMIENTO} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Ubicación" {...ubicacion} placeholder="OFICINA 101" />
            <Input label="Dependencia" {...dependencia} placeholder="ÁREA" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Fecha Adquisición" type="date" value={formData.fechaAdquisicion} onChange={(e) => setFormData({...formData, fechaAdquisicion: e.target.value})} />
            <Input label="Fecha Garantía" type="date" value={formData.fechaGarantia} onChange={(e) => setFormData({...formData, fechaGarantia: e.target.value})} />
          </div>

          <Input 
            label="Responsable" 
            type="select" 
            value={formData.responsableId} 
            onChange={(e) => setFormData({...formData, responsableId: e.target.value})} 
            options={funcionarios.map(f => ({ value: f.id, label: `${f.nombre} ${f.apellido}` }))} 
          />
          
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
