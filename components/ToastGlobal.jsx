'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Bell } from 'lucide-react'

export default function ToastGlobal() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    window.showToast = (message, type = 'info') => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 4000)
    }
  }, [])

  const icons = {
    success: <CheckCircle size={20} className="text-green-400" />,
    error: <XCircle size={20} className="text-red-400" />,
    warning: <AlertTriangle size={20} className="text-yellow-400" />,
    info: <Bell size={20} className="text-blue-400" />,
  }
  
  const colors = {
    success: 'bg-green-500/20 border-green-500/30 text-green-100',
    error: 'bg-red-500/20 border-red-500/30 text-red-100',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-100',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-100',
  }

  return (
    <div className="fixed top-20 right-4 z-[100] space-y-2">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-lg ${colors[t.type] || colors.info}`}
          >
            {icons[t.type] || icons.info}
            <p className="text-sm font-medium">{t.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
