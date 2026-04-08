'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256 }
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
      },
      center: [-95, 55],
      zoom: 3
    })

    map.current.on('load', () => {
      fetch('/data/stranded-sites.geojson')
        .then(r => r.json())
        .then(data => {
          data.features.forEach((site: any) => {
            const emission = site.properties.emission_rate_kg_day || 100
            const size = emission > 3000 ? 14 : emission > 1000 ? 10 : 6
            const el = document.createElement('div')
            el.style.width = size + 'px'
            el.style.height = size + 'px'
            el.style.borderRadius = '50%'
            el.style.background = '#FF8C00'
            el.style.border = '2px solid white'
            el.style.boxShadow = '0 0 4px rgba(0,0,0,0.5)'
            el.style.cursor = 'pointer'
            el.addEventListener('click', function() {
              const w = window as any
              if (w._selectSite) w._selectSite(site)
            })
            new maplibregl.Marker({element: el}).setLngLat(site.geometry.coordinates).addTo(map.current)
          })
        })
    })

    return () => { if (map.current) { map.current.remove(); map.current = null } }
  }, [])

  return <div ref={mapContainer} className="w-full h-full" />
}
