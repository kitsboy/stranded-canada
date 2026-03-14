'use client';

import { MethaneSite } from '../data/sites';
import { useState } from 'react';
import ROICalculator from './ROICalculator';

interface SiteDetailsPanelProps {
  site: MethaneSite;
  onClose: () => void;
}

export default function SiteDetailsPanel({ site, onClose }: SiteDetailsPanelProps) {
  const [showCalculator, setShowCalculator] = useState(false);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'easy': return 'text-green-400';
      case 'moderate': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };
return (
    <div className="absolute top-4 right-4 z-[1000] w-96 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-bold text-white flex-1">{site.name}</h2>
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors flex-shrink-0 order-2"
              title="Close panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">DEMO</span>
            <span className="text-slate-400 text-sm">{site.province} • {site.region}</span>
          </div>
        </div>

        <div className="p-4 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Site Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-xs text-slate-400">Methane Leak</div>
              <div className="text-lg font-bold text-orange-400">{site.emission_rate_kg_day} kg/day</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-xs text-slate-400">CO₂ Equivalent</div>
              <div className="text-lg font-bold text-teal-400">{site.co2e_tons_year} tons/yr</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-xs text-slate-400">Grid Distance</div>
              <div className="text-lg font-bold text-white">{site.distance_to_grid_km} km</div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded">
              <div className="text-xs text-slate-400">Complexity</div>
              <div className={`text-lg font-bold capitalize ${getComplexityColor(site.complexity_score)}`}>
                {site.complexity_score}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded transition-colors flex items-center justify-center gap-2"
          >
            {showCalculator ? 'Hide ROI Calculator' : 'Calculate ROI'}
          </button>
        </div>

        {showCalculator && (
          <div className="border-t border-slate-700">
            <ROICalculator site={site} />
          </div>
        )}
      </div>
    </div>
  );
}
