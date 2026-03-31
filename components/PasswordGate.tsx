'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

interface PasswordGateProps {
  children: React.ReactNode
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Check if user is already authenticated
    const auth = Cookies.get('stranded-auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])
  
  // Prevent hydration mismatch - render simple div until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#1e293b] flex items-center justify-center">
        <div className="text-[#5BC0BE] animate-pulse">Loading...</div>
      </div>
    )
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password protection - in production, use proper authentication
    if (password === 'stranded2024') {
      Cookies.set('stranded-auth', 'true', { expires: 7 })
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password')
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1e293b] flex items-center justify-center">
        <div className="text-[#5BC0BE]">Loading...</div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1e293b] flex items-center justify-center p-4">
        <div className="bg-[#1e293b]/90 border border-[#5BC0BE]/30 rounded-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              <span className="text-[#FF8C00]">Stranded</span> Canada
            </h1>
            <p className="text-gray-400 text-sm">
              Protected Intelligence
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#5BC0BE]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#5BC0BE]"
              />
            </div>
            
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            
            <button
              type="submit"
              className="w-full py-3 bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white font-semibold rounded-lg transition-colors"
            >
              Access Map
            </button>
          </form>
          
          <p className="mt-4 text-xs text-gray-500 text-center">
            Contact GiveAbit for access
          </p>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}
