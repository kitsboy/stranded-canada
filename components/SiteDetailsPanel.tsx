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
          <span className="text-white">{p.location}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Source Type</span>
          <span className="text-white capitalize">{p.sourceType.replace('_', ' ')}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">CH₄ Emissions</span>
          <span className="text-[#FF8C00] font-semibold">
            {p.emissionRateKgCH4PerDay.toLocaleString()} kg/day
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">CO₂e (Yearly)</span>
          <span className="text-white">{p.co2eTonnesPerYear.toLocaleString()} tonnes</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Grid Distance</span>
          <span className="text-white">{p.distanceToGridKm} km</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Internet</span>
          <span className="text-white">{p.internetType}</span>
        </div>
        
        <div className="pt-3 border-t border-[#5BC0BE]/20">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Complexity</span>
            <span className={`font-semibold ${
              p.miningComplexity === 'Easy' ? 'text-green-400' :
              p.miningComplexity === 'Moderate' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {p.miningComplexity}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Approach</span>
            <span className="text-[#5BC0BE]">{p.recommendedApproach}</span>
          </div>
        </div>
        
        <div className="pt-3 border-t border-[#5BC0BE]/20">
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
            p.dataType === 'verified' 
              ? 'bg-[#5BC0BE]/20 text-[#5BC0BE]' 
              : 'bg-gray-700 text-gray-400'
          }`}>
            {p.dataType === 'verified' ? '✓ Verified Data' : 'Demo Data'}
          </span>
        </div>
      </div>
    </div>
  )
}
