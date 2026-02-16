'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    setMounted(true)
    setParticles(Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
    })))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        window.location.href = '/dashboard'
      } else {
        alert(data.error || 'Error al iniciar sesión')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-1 h-1 rounded-full bg-green-400/40"
            initial={{ x: p.x, y: p.y }}
            animate={{
              y: [null, -50, null],
              x: [null, Math.random() * 30 - 15, null],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl glass neon-border shadow-2xl shadow-green-500/20"
      >
        <h2 className="mb-2 text-3xl font-bold text-center text-white">
          Acceso al Sistema
        </h2>
        <p className="mb-8 text-center text-green-400/70">
          Dinamiz TIC
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-green-300/90">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-white bg-slate-800/50 border border-green-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent transition-all duration-300 placeholder-slate-500"
              placeholder="admin@sistema.com"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-green-300/90">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-white bg-slate-800/50 border border-green-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent transition-all duration-300 placeholder-slate-500"
              placeholder="••••••••"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 font-semibold text-slate-900 bg-green-400 rounded-lg hover:bg-green-300 transition-colors duration-300 shadow-lg shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            ) : (
              'Ingresar al Dashboard'
            )}
          </motion.button>
        </form>

        <p className="mt-6 text-xs text-center text-green-300/50">
          Sistema de Gestión v2.0 | Tecnología de vanguardia
        </p>
      </motion.div>
    </div>
  )
}
