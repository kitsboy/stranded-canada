'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import PasswordGate from '@/components/PasswordGate'
import LayerControls from '@/components/LayerControls'
import SiteDetailsPanel from '@/components/SiteDetailsPanel'
import EducationModal from '@/components/EducationModal'
import type { StrandedSite } from '@/types/site'

// Dynamic import for map to avoid SSR issues
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#1e293b] flex items-center justify-center">
      <div className="text-[#5BC0BE] animate-pulse">Loading map...</div>
    </div>
  ),
})

export default function StrandedPage() {
  const [layers, setLayers] = useState({
    sites: true,
    grid: true,
    internet: false,
  })
  
  const [selectedSite, setSelectedSite] = useState<StrandedSite | null>(null)
  
  const handleLayerToggle = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
  }
  
  const handleSiteClick = (site: StrandedSite) => {
    setSelectedSite(site)
  }
  
  return (
    <PasswordGate>
      <div className="relative w-full h-screen bg-[#1e293b] overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-[#1e293b]/90 backdrop-blur border-b border-[#5BC0BE]/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                <span className="mr-2">🍁</span>
                <span className="text-[#FF8C00]">Stranded</span> Canada
              </h1>
              <p className="text-sm text-gray-400">
                Methane capture opportunities for Bitcoin mining
              </p>
            </div>
            <div className="hidden sm:block text-right text-xs text-gray-400">
              <p>GiveAbit Intelligence</p>
              <p>Prototype v0.1</p>
            </div>
          </div>
        </div>
        
        {/* Map Container */}
        <div className="absolute top-[73px] left-0 right-0 bottom-0">
          <Map 
            layers={layers} 
            onSiteClick={handleSiteClick}
          />
        </div>
        
        {/* Layer Controls */}
        <LayerControls 
          layers={layers} 
          onToggle={handleLayerToggle}
        />
        
        {/* Site Details Panel */}
        <SiteDetailsPanel 
          site={selectedSite}
          onClose={() => setSelectedSite(null)}
        />
        
        {/* Education Modal */}
        <EducationModal />
        
        {/* Stats Footer */}
        <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto z-10 bg-[#1e293b]/90 backdrop-blur border border-[#5BC0BE]/30 rounded-xl px-4 py-3 flex gap-6 text-sm">
          <div>
            <span className="text-gray-400">Sites</span>
            <span className="ml-2 text-[#FF8C00] font-bold">28</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-gray-400">Demo</span>
            <span className="ml-2 text-gray-400 font-bold">28</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-gray-400">Verified</span>
            <span className="ml-2 text-[#5BC0BE] font-bold">0</span>
          </div>
          <div className="hidden md:block">
            <span className="text-gray-400">Total CH₄/day</span>
            <span className="ml-2 text-white font-bold">~52,000 kg</span>
          </div>
        </div>
      </div>
    </PasswordGate>
  )
}
