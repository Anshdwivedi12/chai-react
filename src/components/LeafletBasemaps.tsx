import React, { useState } from 'react';
import L from 'leaflet';

interface LeafletBasemapsProps {
  map: L.Map | null;
  log: (message: string, isError?: boolean) => void;
}

export const LeafletBasemaps: React.FC<LeafletBasemapsProps> = ({ map, log }) => {
  const [currentBasemap, setCurrentBasemap] = useState('openstreetmap');
  const [basemapLayer, setBasemapLayer] = useState<L.TileLayer | null>(null);

  const basemaps = [
    {
      id: 'openstreetmap',
      name: '🗺️ OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors'
    },
    {
      id: 'satellite',
      name: '🛰️ Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Esri, DigitalGlobe, GeoEye, Earthstar Geographics'
    },
    {
      id: 'terrain',
      name: '🏔️ Terrain',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '© OpenTopoMap contributors'
    },
    {
      id: 'dark',
      name: '🌙 Dark Mode',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '© CARTO'
    },
    {
      id: 'light',
      name: '☀️ Light Mode',
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '© CARTO'
    }
  ];

  const changeBasemap = (basemapId: string) => {
    if (!map) {
      log('❌ Map not initialized', true);
      return;
    }

    const selectedBasemap = basemaps.find(b => b.id === basemapId);
    if (!selectedBasemap) {
      log('❌ Basemap not found', true);
      return;
    }

    // Remove current basemap layer
    if (basemapLayer) {
      map.removeLayer(basemapLayer);
    }

    // Add new basemap layer
    const newLayer = L.tileLayer(selectedBasemap.url, {
      attribution: selectedBasemap.attribution,
      maxZoom: 19
    });

    newLayer.addTo(map);
    setBasemapLayer(newLayer);
    setCurrentBasemap(basemapId);

    log(`🗺️ Changed basemap to: ${selectedBasemap.name}`);
  };

  return (
    <div>
      <h3 style={{
        color: '#2c3e50',
        marginBottom: '15px',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🗺️ Leaflet Basemaps
      </h3>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {basemaps.map(basemap => (
          <button
            key={basemap.id}
            onClick={() => changeBasemap(basemap.id)}
            style={{
              background: currentBasemap === basemap.id 
                ? 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
                : 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              textAlign: 'left'
            }}
          >
            {basemap.name}
          </button>
        ))}
      </div>

      <div style={{
        marginTop: '15px',
        padding: '10px',
        background: '#f8f9fa',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#6c757d'
      }}>
        <strong>💡 Tip:</strong> Different basemaps are useful for different purposes:
        <br />• Satellite: Great for identifying land features
        <br />• Terrain: Perfect for elevation analysis
        <br />• Dark/Light: Better for data visualization
      </div>
    </div>
  );
};