'use client'

import { useState, useEffect } from 'react'
import CRUDBase, { Button, Modal } from '@/components/CRUDBase'
import { ArrowLeft, Save, FileSpreadsheet, FileText, Search, Monitor, Keyboard, Mouse, Cpu, Eye, X, File } from 'lucide-react'
import { generarHojaVidaExcel, generarHojaVidaPDF } from '@/lib/exportExcel'
import HojaVidaPreview from './HojaVidaPreview'

function InputField({ label, value, field, required, errors = {}, onChange }) {
  const error = errors[field]
  const handleChange = (e) => {
    if (onChange) {
      onChange(field, e.target.value)
    }
  }
  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-green-300/90">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className={`w-full px-3 py-2 bg-slate-800/50 border rounded-lg text-white text-sm focus:outline-none focus:ring-2 uppercase ${
          error 
            ? 'border-red-500 focus:ring-red-400/50' 
            : 'border-green-500/30 focus:ring-green-400/50'
        }`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function HojaVidaForm({ onBack }) {
  const [loading, setLoading] = useState(false)
  const [buscando, setBuscando] = useState(false)
  const [equipos, setEquipos] = useState([])
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState(null)
  const [errors, setErrors] = useState({})
  
  const [formData, setFormData] = useState({
    responsable: '',
    area: '',
    inventario: '',
    marca: '',
    modelo: '',
    serialCpu: '',
    cpu: '',
    procesador: '',
    velocidad: '',
    memoriaRam: '',
    discoDuro: '',
    tipoEquipo: '',
    nombreEquipo: '',
    enRed: '',
    direccionIp: '',
    mac: '',
    sistemaOperativo: '',
    monitorMarca: '',
    monitorSerial: '',
    monitorPlaca: '',
    tecladoMarca: '',
    tecladoSerial: '',
    tecladoPlaca: '',
    mouseMarca: '',
    mouseSerial: '',
    mousePlaca: '',
  })

  const validateForm = () => {
    const newErrors = {}
    if (!formData.inventario.trim()) newErrors.inventario = 'Nº Inventario es requerido'
    if (!formData.marca.trim()) newErrors.marca = 'Marca es requerido'
    if (!formData.modelo.trim()) newErrors.modelo = 'Modelo es requerido'
    if (!formData.serialCpu.trim()) newErrors.serialCpu = 'Serial CPU es requerido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const searchEquipos = async () => {
    if (!busqueda.trim()) return
    setBuscando(true)
    try {
      const res = await fetch(`/api/equipos/computo?search=${busqueda}`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setEquipos(data)
        setShowModal(true)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setBuscando(false)
    }
  }

  const selectEquipo = (equipo) => {
    setEquipoSeleccionado(equipo)
    setFormData({
      ...formData,
      area: equipo.ubicacionObj?.nombre || '',
      inventario: equipo.placa || '',
      marca: equipo.marca || '',
      modelo: equipo.modelo || '',
      serialCpu: equipo.serial || '',
      procesador: equipo.procesador || '',
      memoriaRam: equipo.ram || '',
      discoDuro: equipo.discoDuro || '',
      tipoEquipo: equipo.tipo || '',
      nombreEquipo: '',
      enRed: '',
      direccionIp: equipo.mac || '',
      mac: equipo.mac || '',
      sistemaOperativo: '',
    })
    setShowModal(false)
  }

  const handleSaveToDatabase = async () => {
    if (!validateForm()) {
      alert('Por favor complete los campos obligatorios')
      return
    }
    const dataToSave = previewData || formData
    setLoading(true)
    try {
      const res = await fetch('/api/formatos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dataToSave)
      })
      if (res.ok) {
        alert('Hoja de vida guardada correctamente')
        setPreviewData(null)
        setFormData({
          responsable: '',
          area: '',
          inventario: '',
          marca: '',
          modelo: '',
          serialCpu: '',
          cpu: '',
          procesador: '',
          velocidad: '',
          memoriaRam: '',
          discoDuro: '',
          tipoEquipo: '',
          nombreEquipo: '',
          enRed: '',
          direccionIp: '',
          mac: '',
          sistemaOperativo: '',
          monitorMarca: '',
          monitorSerial: '',
          monitorPlaca: '',
          tecladoMarca: '',
          tecladoSerial: '',
          tecladoPlaca: '',
          mouseMarca: '',
          mouseSerial: '',
          mousePlaca: '',
        })
        setShowPreview(false)
      } else {
        alert('Error al guardar')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleExportExcel = async () => {
    if (!validateForm()) {
      alert('Por favor complete los campos obligatorios')
      return
    }
    const dataToExport = previewData || formData
    setLoading(true)
    try {
      await generarHojaVidaExcel(dataToExport)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al generar el archivo Excel')
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async () => {
    if (!validateForm()) {
      alert('Por favor complete los campos obligatorios')
      return
    }
    const dataToExport = previewData || formData
    setLoading(true)
    try {
      await generarHojaVidaPDF(dataToExport)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al generar el archivo PDF')
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    if (!validateForm()) {
      alert('Por favor complete los campos obligatorios')
      return
    }
    setPreviewData({ ...formData })
    setShowPreview(true)
  }
  
  const handlePreviewChange = (newData) => {
    setPreviewData(newData)
    setFormData(newData)
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value.toUpperCase() }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  return (
    <CRUDBase 
      title="Hoja de Vida de Equipos" 
      subtitle="Diligenciar formato de hoja de vida SENA"
    >
      <div className="mb-6 flex items-center gap-4">
        <Button variant="secondary" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft size={18} />
          Volver
        </Button>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Buscar por placa, serial o marca..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && searchEquipos()}
            className="flex-1 px-4 py-2 bg-slate-800/50 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400/50 uppercase"
          />
          <Button onClick={searchEquipos} disabled={buscando} className="flex items-center gap-2">
            <Search size={18} />
            {buscando ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>
      </div>

      {equipoSeleccionado && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-400 text-sm">
            Equipo seleccionado: <strong>{equipoSeleccionado.marca} {equipoSeleccionado.modelo}</strong> 
            {' - '} Placa: <strong>{equipoSeleccionado.placa}</strong>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu size={20} className="text-green-400" />
            Datos del Equipo
          </h3>
        </div>

        <InputField label="Responsable" value={formData.responsable} field="responsable" errors={errors} onChange={updateField} />
        <InputField label="Área" value={formData.area} field="area" errors={errors} onChange={updateField} />
        <InputField label="Nº Inventario" value={formData.inventario} field="inventario" required errors={errors} onChange={updateField} />
        <InputField label="Marca" value={formData.marca} field="marca" required errors={errors} onChange={updateField} />
        <InputField label="Modelo" value={formData.modelo} field="modelo" required errors={errors} onChange={updateField} />
        <InputField label="Serial CPU" value={formData.serialCpu} field="serialCpu" required errors={errors} onChange={updateField} />
        <InputField label="CPU" value={formData.cpu} field="cpu" errors={errors} onChange={updateField} />
        <InputField label="Procesador" value={formData.procesador} field="procesador" errors={errors} onChange={updateField} />
        <InputField label="Velocidad" value={formData.velocidad} field="velocidad" errors={errors} onChange={updateField} />
        <InputField label="Memoria RAM" value={formData.memoriaRam} field="memoriaRam" errors={errors} onChange={updateField} />
        <InputField label="Disco Duro" value={formData.discoDuro} field="discoDuro" errors={errors} onChange={updateField} />

        <div className="lg:col-span-3">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Monitor size={20} className="text-green-400" />
            Configuración de Red
          </h3>
        </div>

        <InputField label="Nombre del Equipo" value={formData.nombreEquipo} field="nombreEquipo" errors={errors} onChange={updateField} />
        
        <InputField label="Dirección IP" value={formData.direccionIp} field="direccionIp" errors={errors} onChange={updateField} />
        <InputField label="MAC" value={formData.mac} field="mac" errors={errors} onChange={updateField} />

        <div className="lg:col-span-3">
          <h3 className="text-lg font-semibold text-white mb-4">
            Sistema Operativo
          </h3>
        </div>

        <InputField label="Sistema Operativo" value={formData.sistemaOperativo} field="sistemaOperativo" errors={errors} onChange={updateField} />

        <div className="lg:col-span-3">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Monitor size={20} className="text-green-400" />
            Periféricos - Monitor
          </h3>
        </div>

        <InputField label="Marca y/o Modelo Monitor" value={formData.monitorMarca} field="monitorMarca" errors={errors} onChange={updateField} />
        <InputField label="Serial Monitor" value={formData.monitorSerial} field="monitorSerial" errors={errors} onChange={updateField} />
        <InputField label="Placa Monitor" value={formData.monitorPlaca} field="monitorPlaca" errors={errors} onChange={updateField} />

        <div className="lg:col-span-3">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Keyboard size={20} className="text-green-400" />
            Periféricos - Teclado
          </h3>
        </div>

        <InputField label="Marca y/o Modelo Teclado" value={formData.tecladoMarca} field="tecladoMarca" errors={errors} onChange={updateField} />
        <InputField label="Serial Teclado" value={formData.tecladoSerial} field="tecladoSerial" errors={errors} onChange={updateField} />
        <InputField label="Placa Teclado" value={formData.tecladoPlaca} field="tecladoPlaca" errors={errors} onChange={updateField} />

        <div className="lg:col-span-3">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Mouse size={20} className="text-green-400" />
            Periféricos - Mouse
          </h3>
        </div>

        <InputField label="Marca y/o Modelo Mouse" value={formData.mouseMarca} field="mouseMarca" errors={errors} onChange={updateField} />
        <InputField label="Serial Mouse" value={formData.mouseSerial} field="mouseSerial" errors={errors} onChange={updateField} />
        <InputField label="Placa Mouse" value={formData.mousePlaca} field="mousePlaca" errors={errors} onChange={updateField} />
      </div>

      <div className="mt-8 flex flex-wrap justify-end gap-4">
        <Button 
          variant="secondary"
          onClick={handlePreview}
          className="flex items-center gap-2"
        >
          <Eye size={18} />
          Vista Previa
        </Button>
        <Button 
          onClick={handleExportPDF}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <FileText size={18} />
          {loading ? 'Generando...' : 'Exportar PDF'}
        </Button>
        <Button 
          onClick={handleExportExcel}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <FileSpreadsheet size={18} />
          {loading ? 'Generando...' : 'Exportar Excel'}
        </Button>
        <Button 
          onClick={handleSaveToDatabase}
          disabled={loading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <Save size={18} />
          {loading ? 'Guardando...' : 'Guardar en BD'}
        </Button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Seleccionar Equipo" size="lg">
        <div className="max-h-96 overflow-y-auto">
          {equipos.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No se encontraron equipos</p>
          ) : (
            <div className="space-y-2">
              {equipos.map((equipo) => (
                <div
                  key={equipo.id}
                  onClick={() => selectEquipo(equipo)}
                  className="p-3 bg-slate-800/50 border border-green-500/20 rounded-lg cursor-pointer hover:border-green-500/50 transition-all"
                >
                  <p className="text-white font-medium">
                    {equipo.marca} {equipo.modelo}
                  </p>
                  <p className="text-sm text-slate-400">
                    Placa: {equipo.placa} | Serial: {equipo.serial}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="Vista Previa - Hoja de Vida" size="xl">
        <HojaVidaPreview data={previewData || formData} onChange={handlePreviewChange} />
        <div className="mt-6 flex justify-end gap-4">
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Cerrar
          </Button>
          <Button onClick={handleExportPDF} className="flex items-center gap-2">
            <FileText size={18} />
            Exportar PDF
          </Button>
          <Button onClick={handleExportExcel} className="flex items-center gap-2">
            <FileSpreadsheet size={18} />
            Exportar Excel
          </Button>
        </div>
      </Modal>
    </CRUDBase>
  )
}
