'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import PasswordGate from '@/components/PasswordGate'
import SiteDetailsPanel from '@/components/SiteDetailsPanel'
import EducationModal from '@/components/EducationModal'
import Footer from '@/components/Footer'
import type { StrandedSite } from '@/types/site'

const Map = dynamic(() => import('@/components/Map'), { ssr: false })

export default function StrandedPage() {
  const [selectedSite, setSelectedSite] = useState<StrandedSite | null>(null)

  useEffect(() => {
    (window as any)._selectSite = setSelectedSite
    return () => { (window as any)._selectSite = undefined }
  }, [])

  return (
    <PasswordGate>
      <div className="relative w-full h-screen bg-[#1e293b] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 z-20 bg-[#1e293b]/90 backdrop-blur border-b border-[#5BC0BE]/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center">
                <img src="/logo.png" alt="Logo" className="h-8 w-auto mr-2" />
                <span className="text-[#FF8C00]">Stranded</span> Canada
              </h1>
              <p className="text-sm text-gray-400">Methane capture opportunities for Bitcoin mining</p>
            </div>
            <div className="hidden sm:block text-right text-xs text-gray-400">
              <p>GiveAbit Intelligence</p>
              <p>Prototype v0.3.1</p>
            </div>
          </div>
        </div>

        <div className="absolute top-[73px] left-0 right-0 bottom-16">
          <Map />
        </div>

        <SiteDetailsPanel site={selectedSite} onClose={() => setSelectedSite(null)} />
        <EducationModal />
        <Footer />
      </div>
    </PasswordGate>
  )
}
