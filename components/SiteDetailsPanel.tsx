'use client'

import type { StrandedSite } from '@/types/site'

interface SiteDetailsPanelProps {
  site: StrandedSite | null
  onClose: () => void
}

export default function SiteDetailsPanel({ site, onClose }: SiteDetailsPanelProps) {
  if (!site) return null
  
  const p = site.properties
  
  return (
    <div className="absolute top-20 right-4 z-10 bg-[#1e293b]/95 backdrop-blur border border-[#5BC0BE]/30 rounded-xl p-6 shadow-lg max-w-sm">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{p.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Location</span>
          <span className="text-white">{p.city || p.region || "Unknown"}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Source Type</span>
          <span className="text-white capitalize">{p.source_type?.replace('_', ' ') || 'Unknown'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">CH₄ Emissions</span>
          <span className="text-[#FF8C00] font-semibold">
            {(p.emission_rate_kg_day || 0).toLocaleString()} kg/day
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">CO₂e (Yearly)</span>
          <span className="text-white">{(p.co2e_tons_year || 0).toLocaleString()} tonnes</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Grid Distance</span>
          <span className="text-white">{p.distance_to_grid_km || 0} km</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Internet</span>
          <span className="text-white">{p.internet_type || 'Unknown'}</span>
        </div>
        
        <div className="pt-3 border-t border-[#5BC0BE]/20">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Complexity</span>
            <span className={`font-semibold ${
              p.complexity_score === 'easy' ? 'text-green-400' :
              p.complexity_score === 'moderate' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {p.complexity_score || 'Unknown'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Approach</span>
            <span className="text-[#5BC0BE]">{p.recommended_approach || 'Standard'}</span>
          </div>
        </div>
        
        <div className="pt-3 border-t border-[#5BC0BE]/20">
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
            p.confidence === 'high' 
              ? 'bg-[#5BC0BE]/20 text-[#5BC0BE]' 
              : 'bg-gray-700 text-gray-400'
          }`}>
            {p.confidence === 'high' ? '✓ Verified Data' : 'Demo Data'}
          </span>
        </div>
      </div>
    </div>
  )
}