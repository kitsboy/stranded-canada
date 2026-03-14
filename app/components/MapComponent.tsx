'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { demoSites as allSites, MethaneSite } from '../data/sites';
import SiteDetailsPanel from './SiteDetailsPanel';
import SiteListPanel from './SiteListPanel';

// Fix Leaflet default icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore - Leaflet internal property
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: (markerIcon2x as any).src || markerIcon2x,
  iconUrl: (markerIcon as any).src || markerIcon,
  shadowUrl: (markerShadow as any).src || markerShadow,
});

// Custom demo icon
const demoIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #808080; width: 12px; height: 12px; border-radius: 50%; opacity: 0.7; border: 2px solid #FF8C00; cursor: pointer;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);
  const [selectedSite, setSelectedSite] = useState<MethaneSite | null>(null);
  const [visibleSites, setVisibleSites] = useState<MethaneSite[]>(allSites);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMarkerClick = (site: MethaneSite) => {
    setSelectedSite(site);
  };

  const handleClosePanel = () => {
    setSelectedSite(null);
  };

  const handleSiteClose = (siteId: string) => {
    setVisibleSites(prev => prev.filter(s => s.id !== siteId));
    if (selectedSite?.id === siteId) {
      setSelectedSite(null);
    }
  };

  const handleSiteSelect = (site: MethaneSite) => {
    setSelectedSite(site);
  };

  if (!mounted) {
    return <div className="h-screen w-full bg-slate-900 flex items-center justify-center text-white">Loading map...</div>;
  }

  return (
    <div className="h-screen w-full relative">
      {/* Header */}
      <div className="absolute top-4 left-[340px] z-[998] bg-slate-800/90 p-4 rounded-lg shadow-lg border border-slate-700 max-w-sm">
        <h1 className="text-xl font-bold text-white mb-1">Stranded Canada</h1>
        <p className="text-slate-400 text-sm mb-2">Methane Leak Opportunities</p>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-3 h-3 rounded-full bg-green-500 border-2 border-orange-500 inline-block"></span>
          <span className="text-slate-300">ECCC Verified Data</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">{visibleSites.length} of 2,611 sites visible • Updated March 11, 2026</div>
        <p className="text-xs text-slate-500 mt-2">Click any marker for details</p>
      </div>

      {/* Site List Panel */}
      <SiteListPanel
        sites={visibleSites}
        selectedSite={selectedSite}
        onSiteSelect={handleSiteSelect}
        onSiteClose={handleSiteClose}
      />

      {/* Site Details Panel */}
      {selectedSite && (
        <SiteDetailsPanel 
          site={selectedSite} 
          onClose={handleClosePanel} 
        />
      )}

      <MapContainer
        center={[62.4, -96.8]}
        zoom={4}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay checked name={`Methane Sites (${visibleSites.length})`}>
            <LayerGroup>
              {visibleSites.map((site) => (
                <Marker
                  key={site.id}
                  position={[site.lat, site.lon]}
                  icon={demoIcon}
                  eventHandlers={{
                    click: () => handleMarkerClick(site),
                  }}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <h3 className="font-bold text-slate-800">{site.name}</h3>
                      <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded mt-1">{site.data_quality === 'regulatory' ? 'ECCC VERIFIED' : site.data_quality.toUpperCase()}</span>
                      <div className="mt-2 text-sm text-slate-600 space-y-1">
                        <p><strong>Province:</strong> {site.province}</p>
                        <p><strong>Emission:</strong> {site.emission_rate_kg_day} kg/day</p>
                        <p><strong>CO₂e:</strong> {site.co2e_tons_year} tons/year</p>
                        <p><strong>Grid Distance:</strong> {site.distance_to_grid_km} km</p>
                        <p><strong>Internet:</strong> {site.internet_type}</p>
                        <p><strong>Complexity:</strong> {site.complexity_score}</p>
                      </div>
                      <p className="text-xs text-orange-500 mt-2">Click marker for full details & ROI</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
}