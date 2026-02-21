'use client'

import { useState, useEffect } from 'react'
import CRUDBase, { Button, Modal } from '@/components/CRUDBase'
import { FileText, Plus, Edit, Trash2, Eye, ArrowLeft, Search } from 'lucide-react'
import HojaVidaForm from './HojaVidaForm'

export default function HojaVidaList({ onNuevo, onEditar }) {
  const [hojasVida, setHojasVida] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const fetchHojasVida = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/formatos', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setHojasVida(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHojasVida()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este registro?')) return
    
    try {
      const res = await fetch(`/api/formatos?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (res.ok) {
        setHojasVida(hojasVida.filter(h => h.id !== id))
      } else {
        alert('Error al eliminar')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const filteredHojas = hojasVida.filter(h => 
    h.responsable?.toLowerCase().includes(search.toLowerCase()) ||
    h.inventario?.toLowerCase().includes(search.toLowerCase()) ||
    h.marca?.toLowerCase().includes(search.toLowerCase()) ||
    h.area?.toLowerCase().includes(search.toLowerCase())
  )

  const handleView = (item) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  const handleEdit = (item) => {
    onEditar(item)
  }

  const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <CRUDBase 
      title="Hoja de Vida Equipos" 
      subtitle="Registros guardados"
    >
      <div className="mb-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Button onClick={onNuevo} className="flex items-center gap-2">
          <Plus size={18} />
          Nuevo Registro
        </Button>
        
        <div className="relative flex-1 md:max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por responsable, inventario, marca o área..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-green-500/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400/50"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-400">Cargando...</div>
      ) : filteredHojas.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          {search ? 'No se encontraron registros' : 'No hay registros guardados'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 text-slate-300">
              <tr>
                <th className="px-4 py-3 text-left">Inventario</th>
                <th className="px-4 py-3 text-left">Responsable</th>
                <th className="px-4 py-3 text-left">Área</th>
                <th className="px-4 py-3 text-left">Marca/Modelo</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">En Red</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredHojas.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3 text-white">{item.inventario || '-'}</td>
                  <td className="px-4 py-3 text-white">{item.responsable || '-'}</td>
                  <td className="px-4 py-3 text-slate-300">{item.area || '-'}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {item.marca} {item.modelo}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{item.tipoEquipo || '-'}</td>
                  <td className="px-4 py-3 text-slate-300">{item.enRed || '-'}</td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleView(item)}
                        className="p-1.5 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                        title="Ver"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Detalle Hoja de Vida" size="lg">
        {selectedItem && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400">Responsable:</span>
                <p className="text-white font-medium">{selectedItem.responsable || '-'}</p>
              </div>
              <div>
                <span className="text-slate-400">Área:</span>
                <p className="text-white font-medium">{selectedItem.area || '-'}</p>
              </div>
              <div>
                <span className="text-slate-400">Nº Inventario:</span>
                <p className="text-white font-medium">{selectedItem.inventario || '-'}</p>
              </div>
              <div>
                <span className="text-slate-400">Marca/Modelo:</span>
                <p className="text-white font-medium">{selectedItem.marca} {selectedItem.modelo}</p>
              </div>
              <div>
                <span className="text-slate-400">Serial CPU:</span>
                <p className="text-white font-medium">{selectedItem.serialCpu || '-'}</p>
              </div>
              <div>
                <span className="text-slate-400">Procesador:</span>
                <p className="text-white font-medium">{selectedItem.procesador || '-'}</p>
              </div>
              <div>
                <span className="text-slate-400">Memoria RAM:</span>
                <p className="text-white font-medium">{selectedItem.memoriaRam || '-'}</p>
              </div>
              <div>
                <span className="text-slate-400">Disco Duro:</span>
                <p className="text-white font-medium">{selectedItem.discoDuro || '-'}</p>
              </div>
              <div>
                <span className="text-slate-400">Tipo Equipo:</span>
                <p className="text-white font-medium">{selectedItem.tipoEquipo || '-'}</p>
              </div>
              <div>
                <span className="text-slate-400">En Red:</span>
                <p className="text-white font-medium">{selectedItem.enRed || '-'}</p>
              </div>
              <div>
                <span className="text-slate-400">Dirección IP:</span>
                <p className="text-white font-medium">{selectedItem.direccionIp || '-'}</p>
              </div>
              <div>
                <span className="text-slate-400">MAC:</span>
                <p className="text-white font-medium">{selectedItem.mac || '-'}</p>
              </div>
              <div>
                <span className="text-slate-400">Sistema Operativo:</span>
                <p className="text-white font-medium">{selectedItem.sistemaOperativo || '-'}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-700">
              <h4 className="text-white font-medium mb-2">Periféricos</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Monitor:</span>
                  <p className="text-white">{selectedItem.monitorMarca} - {selectedItem.monitorSerial}</p>
                </div>
                <div>
                  <span className="text-slate-400">Teclado:</span>
                  <p className="text-white">{selectedItem.tecladoMarca} - {selectedItem.tecladoSerial}</p>
                </div>
                <div>
                  <span className="text-slate-400">Mouse:</span>
                  <p className="text-white">{selectedItem.mouseMarca} - {selectedItem.mouseSerial}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </CRUDBase>
  )
}
