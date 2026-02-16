'use client'

import { useState, useEffect } from 'react'
import CRUDBase, { DataTable, Modal, Button, Input, useUpperCase } from '@/components/CRUDBase'
import { Plus, UserCog, Shield, ShieldAlert, UserCheck } from 'lucide-react'

const roles = [
  { value: 'Administrador', label: 'Administrador', desc: 'Acceso total al sistema', icon: Shield },
  { value: 'Superusuario', label: 'Superusuario', desc: 'Todo excepto usuarios', icon: ShieldAlert },
  { value: 'TecnicoN1', label: 'Técnico N1', desc: 'Tickets, equipos, periféricos', icon: UserCheck },
]

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  const nombre = useUpperCase('')
  const apellido = useUpperCase('')
  const email = useUpperCase('', true)
  const emailInstitucional = useUpperCase('', true)
  const password = useUpperCase('')
  const [passwordValue, setPasswordValue] = useState('')
  const handlePasswordChange = (e) => setPasswordValue(e.target.value)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    rol: 'TecnicoN1',
    activo: true,
  })

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const fetchUsuarios = async () => {
    try {
      const res = await fetch('/api/usuarios', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUsuarios(data)
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
      const url = editData ? `/api/usuarios/${editData.id}` : '/api/usuarios'
      const method = editData ? 'PUT' : 'POST'
      
      const bodyData = {
        nombre: nombre.value,
        apellido: apellido.value,
        email: email.value,
        emailInstitucional: emailInstitucional.value || null,
        rol: formData.rol,
        activo: formData.activo,
      }

      if (!editData || passwordValue) {
        bodyData.password = passwordValue
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      })

      if (res.ok) {
        setModalOpen(false)
        setEditData(null)
        resetForm()
        fetchUsuarios()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al guardar')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const togglePassword = () => setShowPassword(!showPassword)

  const handleEdit = (usuario) => {
    setEditData(usuario)
    nombre.setValue(usuario.nombre)
    apellido.setValue(usuario.apellido)
    email.setValue(usuario.email)
    emailInstitucional.setValue(usuario.emailInstitucional || '')
    setPasswordValue('')
    setFormData({
      rol: usuario.rol,
      activo: usuario.activo,
    })
    setModalOpen(true)
  }

  const handleDelete = async (usuario) => {
    if (!confirm(`¿Eliminar usuario ${usuario.nombre} ${usuario.apellido}?`)) return
    
    try {
      const res = await fetch(`/api/usuarios/${usuario.id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchUsuarios()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al eliminar')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const resetForm = () => {
    nombre.setValue('')
    apellido.setValue('')
    email.setValue('')
    emailInstitucional.setValue('')
    setPasswordValue('')
    setFormData({
      rol: 'TecnicoN1',
      activo: true,
    })
  }

  const getRolBadge = (rol) => {
    const config = {
      Administrador: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      Superusuario: 'bg-red-500/20 text-red-400 border-red-500/30',
      TecnicoN1: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    }
    const labels = {
      Administrador: 'Administrador',
      Superusuario: 'Superusuario',
      TecnicoN1: 'Técnico N1',
    }
    return <span className={`px-2 py-1 rounded-full text-xs border ${config[rol]}`}>{labels[rol]}</span>
  }

  const getActivoBadge = (activo) => {
    return activo 
      ? <span className="px-2 py-1 rounded-full text-xs border bg-green-500/20 text-green-400 border-green-500/30">Activo</span>
      : <span className="px-2 py-1 rounded-full text-xs border bg-slate-500/20 text-slate-400 border-slate-500/30">Inactivo</span>
  }

  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'apellido', header: 'Apellido' },
    { key: 'email', header: 'Email' },
    { key: 'rol', header: 'Rol', render: (val) => getRolBadge(val) },
    { key: 'activo', header: 'Estado', render: (val) => getActivoBadge(val) },
  ]

  return (
    <CRUDBase title="Usuarios" subtitle="Gestión de usuarios del sistema">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => { resetForm(); setEditData(null); setModalOpen(true) }}>
          <span className="flex items-center gap-2">
            <Plus size={18} /> Nuevo Usuario
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
          data={usuarios} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchFields={['nombre', 'apellido', 'email', 'rol']}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editData ? 'Editar Usuario' : 'Nuevo Usuario'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nombre" {...nombre} required placeholder="NOMBRE" />
            <Input label="Apellido" {...apellido} required placeholder="APELLIDO" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Email" type="email" {...email} required placeholder="correo@correo.com" />
            <Input label="Email Institucional" type="email" {...emailInstitucional} placeholder="correo@institucion.edu" />
          </div>

          {!editData && (
            <div className="relative">
              <Input label="Contraseña" type={showPassword ? 'text' : 'password'} value={passwordValue} onChange={handlePasswordChange} required placeholder="••••••••" />
              <button type="button" onClick={togglePassword} className="absolute right-3 top-9 text-slate-400 hover:text-green-400">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          )}

          {editData && (
            <div className="relative">
              <Input label="Nueva Contraseña (opcional)" type={showPassword ? 'text' : 'password'} value={passwordValue} onChange={handlePasswordChange} placeholder="••••••••" />
              <button type="button" onClick={togglePassword} className="absolute right-3 top-9 text-slate-400 hover:text-green-400">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm font-medium text-green-300/90">Rol</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setFormData({...formData, rol: r.value})}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    formData.rol === r.value 
                      ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                      : 'bg-slate-800/50 border-green-500/20 text-slate-400 hover:border-green-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <r.icon size={16} />
                    <span className="font-medium text-sm">{r.label}</span>
                  </div>
                  <p className="text-xs opacity-70">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {editData && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="activo"
                checked={formData.activo}
                onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                className="w-4 h-4 rounded bg-slate-800 border-green-500/30 text-green-500 focus:ring-green-500/50"
              />
              <label htmlFor="activo" className="text-sm text-green-300/90">Usuario activo</label>
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
