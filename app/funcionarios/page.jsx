'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CRUDBase, { DataTable, Modal, Button, Input, useUpperCase } from '@/components/CRUDBase'
import { Plus } from 'lucide-react'

const tiposFuncionario = [
  { value: 'Docente', label: 'Docente' },
  { value: 'Administrativo', label: 'Administrativo' },
  { value: 'Aprendiz', label: 'Aprendiz' },
  { value: 'Contratista', label: 'Contratista' },
]

export default function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  
  const nombre = useUpperCase('')
  const apellido = useUpperCase('')
  const cedula = useUpperCase('')
  const telefono = useUpperCase('')
  const emailPersonal = useUpperCase('', true)
  const emailInstitucional = useUpperCase('', true)
  const dependencia = useUpperCase('')
  const cargo = useUpperCase('')
  const [tipo, setTipo] = useState('')

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    tipo: '',
    telefono: '',
    emailPersonal: '',
    emailInstitucional: '',
    dependencia: '',
    cargo: '',
  })

  useEffect(() => {
    fetchFuncionarios()
  }, [])

  const fetchFuncionarios = async () => {
    try {
      const res = await fetch('/api/funcionarios')
      if (res.ok) {
        const data = await res.json()
        setFuncionarios(data)
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
      const url = editData ? `/api/funcionarios/${editData.id}` : '/api/funcionarios'
      const method = editData ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.value,
          apellido: apellido.value,
          cedula: cedula.value,
          tipo: tipo,
          telefono: telefono.value,
          emailPersonal: emailPersonal.value,
          emailInstitucional: emailInstitucional.value,
          dependencia: dependencia.value,
          cargo: cargo.value,
        }),
      })

      if (res.ok) {
        setModalOpen(false)
        setEditData(null)
        resetForm()
        fetchFuncionarios()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al guardar')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleEdit = (funcionario) => {
    setEditData(funcionario)
    nombre.setValue(funcionario.nombre)
    apellido.setValue(funcionario.apellido)
    cedula.setValue(funcionario.cedula)
    setTipo(funcionario.tipo)
    telefono.setValue(funcionario.telefono || '')
    emailPersonal.setValue(funcionario.emailPersonal || '')
    emailInstitucional.setValue(funcionario.emailInstitucional)
    dependencia.setValue(funcionario.dependencia || '')
    cargo.setValue(funcionario.cargo || '')
    setModalOpen(true)
  }

  const handleDelete = async (funcionario) => {
    if (!confirm(`¿Eliminar a ${funcionario.nombre} ${funcionario.apellido}?`)) return
    
    try {
      const res = await fetch(`/api/funcionarios/${funcionario.id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchFuncionarios()
      } else {
        alert('Error al eliminar')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const resetForm = () => {
    nombre.setValue('')
    apellido.setValue('')
    cedula.setValue('')
    setTipo('')
    telefono.setValue('')
    emailPersonal.setValue('')
    emailInstitucional.setValue('')
    dependencia.setValue('')
    cargo.setValue('')
  }

  const columns = [
    { key: 'cedula', header: 'Cédula' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'apellido', header: 'Apellido' },
    { key: 'tipo', header: 'Tipo' },
    { key: 'emailInstitucional', header: 'Email Institucional' },
    { key: 'cargo', header: 'Cargo' },
  ]

  return (
    <CRUDBase title="Funcionarios" subtitle="Gestión de personal institucional">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => { resetForm(); setEditData(null); setModalOpen(true) }}>
          <span className="flex items-center gap-2">
            <Plus size={18} /> Nuevo Funcionario
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
          data={funcionarios} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchFields={['cedula', 'nombre', 'apellido', 'emailInstitucional', 'cargo']}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Editar Funcionario' : 'Nuevo Funcionario'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nombre" {...nombre} required placeholder="NOMBRE" />
            <Input label="Apellido" {...apellido} required placeholder="APELLIDO" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Cédula" {...cedula} required placeholder="12345678" />
            <Input label="Tipo" type="select" value={tipo} onChange={(e) => setTipo(e.target.value)} options={tiposFuncionario} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Teléfono" {...telefono} placeholder="3001234567" />
            <Input label="Email Personal" type="email" {...emailPersonal} placeholder="correo@personal.com" />
          </div>
          <Input label="Email Institucional" type="email" {...emailInstitucional} required placeholder="nombre@institucion.edu" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Dependencia" {...dependencia} placeholder="ÁREA" />
            <Input label="Cargo" {...cargo} placeholder="PUESTO" />
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editData ? 'Actualizar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>
    </CRUDBase>
  )
}
