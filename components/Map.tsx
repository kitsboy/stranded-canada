'use client'

import { useEffect, useRef, useState } from 'react'
import type { StrandedSite } from '@/types/site'

interface MapProps {
  layers: {
    sites: boolean
    grid: boolean
    internet: boolean
  }
  onSiteClick: (site: StrandedSite) => void
}

// Canadian bounds
const canadaBounds: [[number, number], [number, number]] = [
  [41.0, -141.0],
  [83.0, -52.0]
]

export default function Map({ layers, onSiteClick }: MapProps) {
  const mapRef = useRef<any>(null)
  const LRef = useRef<any>(null)
  const layersRef = useRef<{sites: any, grid: any, internet: any}>({sites: null, grid: null, internet: null})
  const [isClient, setIsClient] = useState(false)
  const [sitesData, setSitesData] = useState<StrandedSite[]>([])
  
  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      const L = await import('leaflet')
      LRef.current = L
      
      // Fix markers
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
      
      setIsClient(true)
    }
    loadLeaflet()
  }, [])
  
  // Fetch sites
  useEffect(() => {
    fetch('/data/stranded-sites.geojson')
      .then(res => res.json())
      .then(data => setSitesData(data.features || []))
  }, [])
  
  // Initialize map when Leaflet loaded
  useEffect(() => {
    if (!isClient || !LRef.current || sitesData.length === 0) return
    
    const L = LRef.current
    
    const map = L.map('map', {
      center: [55, -95],
      zoom: 4,
      minZoom: 3,
      maxBounds: canadaBounds,
      maxBoundsViscosity: 0.5,
    })
    
    mapRef.current = map
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)
    
    layersRef.current.sites = L.layerGroup().addTo(map)
    layersRef.current.grid = L.layerGroup().addTo(map)
    layersRef.current.internet = L.layerGroup().addTo(map)
    
    // Add sites
    sitesData.forEach((site) => {
      const [lng, lat] = site.geometry.coordinates
      const props = site.properties
      const emission = props.emission_rate_kg_day || ((props.ch4_tonnes_year || 0) * 1000 / 365) || 100
      
      const size = emission >= 5000 ? 20 : emission >= 2000 ? 16 : emission >= 500 ? 12 : 8
      
      const marker = L.circleMarker([lat, lng], {
        radius: size,
        fillColor: props.source_type?.includes('oil') ? '#FF8C00' : 
                   props.source_type?.includes('landfill') ? '#22C55E' : '#5BC0BE',
        color: '#fff',
        weight: 1,
        fillOpacity: 0.8,
      })
      
      marker.on('click', () => onSiteClick(site))
      marker.bindTooltip(
        `<strong>${props.name}</strong><br/>
         ${props.company || 'Unknown'}<br/>
         ${Math.round(emission).toLocaleString()} kg CH₄/day`,
        { direction: 'top', offset: [0, -10] }
      )
      
      layersRef.current.sites.addLayer(marker)
    })
    
    return () => { map.remove() }
  }, [isClient, sitesData, onSiteClick])
  
  // Toggle layers
  useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current
    
    if (layers.sites) map.addLayer(layersRef.current.sites)
    else map.removeLayer(layersRef.current.sites)
    
    if (layers.grid) map.addLayer(layersRef.current.grid)
    else map.removeLayer(layersRef.current.grid)
  }, [layers])
  
  if (!isClient) {
    return (
      <div className="w-full h-full bg-[#1e293b] flex items-center justify-center text-[#5BC0BE]">
        <div>🌿 Loading 2,611 sites...</div>
      </div>
    )
  }
  
  return <div id="map" className="w-full h-full" style={{height: '100vh', width: '100%'}} />
}
