import React from 'react';

export const LeafletBasemaps: React.FC = () => {
  return (
    <section style={{ background: '#ffffff', borderRadius: 12, padding: 16, border: '1px solid #eaecee' }}>
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>🗺️ Leaflet Basemaps</h3>
      <p style={{ margin: 0, color: '#475569' }}>Switch between common base maps (OSM, Satellite, Terrain).</p>
    </section>
  );
};

