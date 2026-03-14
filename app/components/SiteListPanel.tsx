'use client';

import { useState } from 'react';
import { ChevronDown, X, Search, Filter } from 'lucide-react';
import { MethaneSite } from '../data/sites';

interface SiteListPanelProps {
  sites: MethaneSite[];
  selectedSite: MethaneSite | null;
  onSiteSelect: (site: MethaneSite) => void;
  onSiteClose: (siteId: string) => void;
}

export default function SiteListPanel({ 
  sites, 
  selectedSite, 
  onSiteSelect,
  onSiteClose 
}: SiteListPanelProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const toggleExpand = (siteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(siteId)) {
      newExpanded.delete(siteId);
    } else {
      newExpanded.add(siteId);
    }
    setExpandedCards(newExpanded);
  };

  const handleClose = (siteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSiteClose(siteId);
  };

  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getComplexityBadge = (complexity: string) => {
    switch (complexity) {
      case 'easy':
        return <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full border border-green-500/30">Easy</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">Moderate</span>;
      case 'hard':
        return <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full border border-red-500/30">Hard</span>;
      default:
        return null;
    }
  };

  if (!isPanelOpen) {
    return (
      <button
        onClick={() => setIsPanelOpen(true)}
        className="absolute top-4 left-4 z-[999] bg-slate-800/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-700 hover:bg-slate-700 transition-colors"
        title="Show site list"
      >
        <Filter className="w-5 h-5 text-teal-400" />
        <span className="ml-2 text-sm text-white">{sites.length} Sites</span>
      </button>
    );
  }

  return (
    <div className="absolute top-4 left-4 z-[999] w-80 max-h-[calc(100vh-2rem)] flex flex-col">
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-slate-700 overflow-hidden">
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Site List</h2>
            <p className="text-xs text-slate-400">{filteredSites.length} of {sites.length} sites</p>
          </div>
          <button
            onClick={() => setIsPanelOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Hide panel"
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Site List */}
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
          {filteredSites.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p>No sites found</p>
            </div>
          ) : (
            filteredSites.map((site) => {
              const isExpanded = expandedCards.has(site.id);
              const isSelected = selectedSite?.id === site.id;

              return (
                <div
                  key={site.id}
                  className={`border-b border-slate-700 last:border-b-0 transition-colors ${
                    isSelected ? 'bg-teal-500/10' : 'hover:bg-slate-700/50'
                  }`}
                >
                  {/* Card Header - Always Visible */}
                  <div
                    onClick={() => onSiteSelect(site)}
                    className="p-3 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">
                          {site.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {site.province} • {site.emission_rate_kg_day.toLocaleString()} kg/day
                        </p>
                      </div>
                      
                      {/* Action Buttons - Properly spaced */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Expand/Collapse Button */}
                        <button
                          onClick={(e) => toggleExpand(site.id, e)}
                          className={`p-1.5 rounded-lg transition-all ${
                            isExpanded 
                              ? 'bg-slate-600 text-teal-400' 
                              : 'text-slate-400 hover:text-teal-400 hover:bg-slate-700'
                          }`}
                          title={isExpanded ? "Collapse details" : "Expand details"}
                        >
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                          />
                        </button>
                        
                        {/* Close Button - Positioned with margin-left to avoid overlap */}
                        <button
                          onClick={(e) => handleClose(site.id, e)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all ml-0.5"
                          title="Remove from list"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      {getComplexityBadge(site.complexity_score)}
                      <span className="text-xs text-slate-500">
                        Grid: {site.distance_to_grid_km}km • {site.internet_type}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0 border-t border-slate-700/50">
                      <div className="pt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">CO₂e/year:</span>
                          <span className="text-white">{site.co2e_tons_year.toLocaleString()} tons</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Region:</span>
                          <span className="text-white">{site.region}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Coordinates:</span>
                          <span className="text-slate-500 text-xs">
                            {site.lat.toFixed(4)}, {site.lon.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Data Quality:</span>
                          <span className="text-orange-400 text-xs uppercase">{site.data_quality}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
