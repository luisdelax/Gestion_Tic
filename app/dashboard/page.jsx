'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  MapPin,
  Users, 
  Computer, 
  Wifi, 
  Ticket, 
  Calendar, 
  Warehouse,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  Monitor,
  Speaker,
  HardDrive,
  UserCog,
  CheckCircle,
  CheckSquare,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePath, setActivePath] = useState('/dashboard')
  const [notificaciones, setNotificaciones] = useState([])
  const [notifSinLeer, setNotifSinLeer] = useState(0)
  const [showNotif, setShowNotif] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [tareasRecientes, setTareasRecientes] = useState([])
  const [tareasOverdue, setTareasOverdue] = useState(0)

  useEffect(() => {
    fetchUser()
    fetchNotificaciones()
    fetchDashboardData()
    fetchTareas()
  }, [])

  const fetchTareas = async () => {
    try {
      const res = await fetch('/api/tareas', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setTareasRecientes(data.tareas.slice(0, 5))
        setTareasOverdue(data.overdueCount || 0)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchNotificaciones = async () => {
    try {
      const res = await fetch('/api/notificaciones', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setNotificaciones(data.notificaciones)
        setNotifSinLeer(data.sinLeer)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const marcarLeida = async (id) => {
    try {
      await fetch('/api/notificaciones', { credentials: 'include', 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      fetchNotificaciones()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const marcarTodasLeidas = async () => {
    try {
      await fetch('/api/notificaciones', { credentials: 'include', 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todas: true })
      })
      fetchNotificaciones()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleLogout = async () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.location.href = '/login'
  }

  const handleTareaEstadoChange = async (tareaId, nuevoEstado) => {
    try {
      await fetch(`/api/tareas/${tareaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ estado: nuevoEstado }),
      })
      fetchTareas()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getPrioridadColor = (prioridad) => {
    const colors = {
      Urgente: 'text-red-400 bg-red-500/20',
      Alta: 'text-orange-400 bg-orange-500/20',
      Media: 'text-yellow-400 bg-yellow-500/20',
      Baja: 'text-green-400 bg-green-500/20',
    }
    return colors[prioridad] || colors.Media
  }

  const getEstadoColor = (estado) => {
    const colors = {
      Pendiente: 'text-slate-400 bg-slate-500/20',
      EnProceso: 'text-blue-400 bg-blue-500/20',
      Completada: 'text-green-400 bg-green-500/20',
      Cancelada: 'text-red-400 bg-red-500/20',
    }
    return colors[estado] || colors.Pendiente
  }

  const isOverdue = (tarea) => {
    if (tarea.fechaLimite && tarea.estado !== 'Completada' && tarea.estado !== 'Cancelada') {
      return new Date(tarea.fechaLimite) < new Date()
    }
    return false
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActivePath(window.location.pathname)
    }
  }, [])

  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
    { icon: Users, label: 'Funcionarios', href: '/funcionarios', roles: ['Administrador', 'Superusuario'] },
    { icon: Computer, label: 'Equipos Computo', href: '/equipos/computo', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
    { icon: Wifi, label: 'Telecomunicaciones', href: '/equipos/telecom', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
    { icon: HardDrive, label: 'Periféricos', href: '/perifericos', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
    { icon: Monitor, label: 'Audiovisuales', href: '/audiovisuales', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
    { icon: Ticket, label: 'Tickets', href: '/tickets', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
    { icon: CheckSquare, label: 'Tareas', href: '/tareas', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
    { icon: MapPin, label: 'Ubicaciones', href: '/ubicaciones', roles: ['Administrador', 'Superusuario'] },
    { icon: Warehouse, label: 'Préstamos', href: '/prestamos', roles: ['Administrador', 'Superusuario'] },
    { icon: Calendar, label: 'Auditorio', href: '/auditorio', roles: ['Administrador', 'Superusuario'] },
    { icon: UserCog, label: 'Usuarios', href: '/usuarios', roles: ['Administrador'] },
    { icon: FileText, label: 'Informes', href: '/informes', roles: ['Administrador', 'Superusuario'] },
    { icon: Settings, label: 'Configuración', href: '/configuracion', roles: ['Administrador', 'Superusuario', 'TecnicoN1'] },
  ]

  const menuItems = allMenuItems.filter(item => user && item.roles.includes(user.rol))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="bg-slate-950 border-r border-green-500/20 flex flex-col"
      >
        <div className="p-4 border-b border-green-500/20">
          <h1 className={`font-bold text-green-400 transition-all ${sidebarOpen ? 'text-xl' : 'text-lg text-center'}`}>
            {sidebarOpen ? 'Dinamiz TIC' : 'DT'}
          </h1>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                activePath === item.href
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-green-300'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="p-3 border-t border-green-500/20">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-slate-950/50 border-b border-green-500/20 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-800 text-green-400"
            >
              <Menu size={20} />
            </button>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 bg-slate-800/50 border border-green-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotif(!showNotif)}
                className="p-2 rounded-lg hover:bg-slate-800 text-green-400 relative"
              >
                <Bell size={20} />
                {notifSinLeer > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {notifSinLeer > 9 ? '9+' : notifSinLeer}
                  </span>
                )}
              </button>
              
              {showNotif && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-green-500/30 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-green-500/20 flex items-center justify-between">
                    <h3 className="text-white font-medium">Notificaciones</h3>
                    {notifSinLeer > 0 && (
                      <button 
                        onClick={marcarTodasLeidas}
                        className="text-xs text-green-400 hover:text-green-300"
                      >
                        Marcar todo leído
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notificaciones.length > 0 ? (
                      notificaciones.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => { if (!notif.leida) marcarLeida(notif.id) }}
                          className={`p-3 border-b border-green-500/10 cursor-pointer hover:bg-slate-800/50 transition-colors ${
                            !notif.leida ? 'bg-green-500/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {!notif.leida && (
                              <span className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></span>
                            )}
                            <div className="flex-1">
                              <p className={`text-sm ${notif.leida ? 'text-slate-400' : 'text-white'}`}>
                                {notif.titulo}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">{notif.mensaje}</p>
                              <p className="text-xs text-green-400/50 mt-1">
                                {new Date(notif.createdAt).toLocaleString('es-CO')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-slate-500 text-sm">
                        Sin notificaciones
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <a href="/configuracion" className="flex items-center gap-3 hover:bg-slate-800/50 p-2 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <span className="text-green-400 font-medium">
                  {user?.nombre?.[0]}{user?.apellido?.[0]}
                </span>
              </div>
              <div className="text-sm">
                <p className="text-white font-medium">{user?.nombre} {user?.apellido}</p>
                <p className="text-green-400/70">{user?.rol}</p>
              </div>
            </a>
          </div>
        </header>

        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-white">Bienvenido, {user?.nombre}</h2>
            <p className="text-green-400/70">Panel de Control - {user?.rol}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 border border-green-500/20 rounded-xl p-4 md:p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <CheckSquare size={20} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Tareas Recientes</h3>
                  <p className="text-slate-400 text-sm">Gestión rápida de tareas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {tareasOverdue > 0 && (
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm flex items-center gap-1">
                    <AlertTriangle size={14} />
                    {tareasOverdue} vencida{tareasOverdue > 1 ? 's' : ''}
                  </span>
                )}
                <button 
                  onClick={() => window.location.href = '/tareas'}
                  className="text-green-400 hover:text-green-300 text-sm"
                >
                  Ver todas →
                </button>
              </div>
            </div>

            {tareasRecientes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {tareasRecientes.map((tarea) => (
                  <div 
                    key={tarea.id}
                    className={`p-3 rounded-lg border ${isOverdue(tarea) ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/20 bg-slate-700/30'} hover:border-green-500/40 transition-all`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${getPrioridadColor(tarea.prioridad)}`}>
                        {tarea.prioridad}
                      </span>
                      {isOverdue(tarea) && <AlertTriangle size={14} className="text-red-400" />}
                    </div>
                    <h4 className="text-white text-sm font-medium mb-2 line-clamp-2">{tarea.titulo}</h4>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-xs ${getEstadoColor(tarea.estado)}`}>
                        {tarea.estado === 'EnProceso' ? 'En Proceso' : tarea.estado}
                      </span>
                      {tarea.estado !== 'Completada' && tarea.estado !== 'Cancelada' && (
                        <select
                          value={tarea.estado}
                          onChange={(e) => handleTareaEstadoChange(tarea.id, e.target.value)}
                          className="text-xs bg-slate-600 text-white rounded px-1 py-0.5 border-none cursor-pointer"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="EnProceso">En Proceso</option>
                          <option value="Completada">Completada</option>
                          <option value="Cancelada">Cancelada</option>
                        </select>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <CheckCircle size={32} className="mx-auto mb-2 opacity-50" />
                <p>No hay tareas pendientes</p>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[
              { label: 'Tickets Abiertos', value: dashboardData?.stats?.ticketsAbiertos || 0, icon: AlertCircle, color: 'bg-red-500', href: '/tickets' },
              { label: 'Equipos Activos', value: dashboardData?.stats?.equiposActivos || 0, icon: Computer, color: 'bg-green-500', href: '/equipos/computo' },
              { label: 'Funcionarios', value: dashboardData?.stats?.funcionarios || 0, icon: Users, color: 'bg-blue-500', href: '/funcionarios' },
              { label: 'Préstamos Activos', value: dashboardData?.stats?.prestamos || 0, icon: Warehouse, color: 'bg-purple-500', href: '/prestamos' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all cursor-pointer group"
                onClick={() => window.location.href = stat.href}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 text-sm">{stat.label}</span>
                  <div className={`p-2 rounded-lg ${stat.color}/20 group-hover:${stat.color}/30 transition-colors`}>
                    <stat.icon size={20} className={stat.color.replace('bg-', 'text-')} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/50 border border-green-500/20 rounded-xl p-6"
            >
              <h3 className="text-white font-medium mb-4">Tickets por Estado</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData?.charts?.ticketsPorEstado || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dashboardData?.charts?.ticketsPorEstado?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #22c55e', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-800/50 border border-green-500/20 rounded-xl p-6"
            >
              <h3 className="text-white font-medium mb-4">Equipos por Tipo</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData?.charts?.equiposPorTipo || []}>
                    <XAxis dataKey="tipo" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #22c55e', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="cantidad" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-slate-800/50 border border-green-500/20 rounded-xl p-6"
            >
              <h3 className="text-white font-medium mb-4">Tickets por Mes</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData?.charts?.ticketsPorMes || []}>
                    <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #22c55e', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="cantidad" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-slate-800/50 border border-green-500/20 rounded-xl p-6"
            >
              <h3 className="text-white font-medium mb-4">Estado de Equipos</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData?.charts?.estadoEquipos || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dashboardData?.charts?.estadoEquipos?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #22c55e', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-800/30 border border-green-500/10 rounded-xl p-4 text-center">
              <Monitor size={24} className="text-green-400 mx-auto mb-2" />
              <p className="text-slate-400 text-xs">Audiovisuales</p>
              <p className="text-white text-xl font-bold">{dashboardData?.stats?.audiovisuales || 0}</p>
            </div>
            <div className="bg-slate-800/30 border border-green-500/10 rounded-xl p-4 text-center">
              <HardDrive size={24} className="text-green-400 mx-auto mb-2" />
              <p className="text-slate-400 text-xs">Periféricos</p>
              <p className="text-white text-xl font-bold">{dashboardData?.stats?.perifericos || 0}</p>
            </div>
            <div className="bg-slate-800/30 border border-green-500/10 rounded-xl p-4 text-center">
              <CheckCircle size={24} className="text-green-400 mx-auto mb-2" />
              <p className="text-slate-400 text-xs">Tickets Resueltos</p>
              <p className="text-white text-xl font-bold">{dashboardData?.stats?.ticketsResueltos || 0}</p>
            </div>
            <div className="bg-slate-800/30 border border-green-500/10 rounded-xl p-4 text-center">
              <Calendar size={24} className="text-green-400 mx-auto mb-2" />
              <p className="text-slate-400 text-xs">Reservas Próximas</p>
              <p className="text-white text-xl font-bold">{dashboardData?.stats?.reservasProximas || 0}</p>
            </div>
          </div>
        </main>

        <footer className="py-4 px-6 border-t border-green-500/20 bg-slate-950/30">
          <p className="text-center text-slate-500 text-sm">
            © 2024 Dinamiz TIC. Todos los derechos reservados a Luis E De La Cruz Fajardo
          </p>
        </footer>
      </div>
    </div>
  )
}
