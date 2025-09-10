import React, { useState } from 'react';

import { DataUpload } from './components/DataUpload';
import { DataManagement } from './components/DataManagement';
import { MyDatasets } from './components/MyDatasets';
import { LeafletBasemaps } from './components/LeafletBasemaps';
import { VectorOperations } from './components/VectorOperations';
import { SmartFiltering } from './components/SmartFiltering';
import { ProfessionalFilters } from './components/ProfessionalFilters';
import { AdvancedQueries } from './components/AdvancedQueries';
import { Placeholder } from './components/Placeholder';

type TabKey = 'data' | 'layers' | 'vector' | 'weather' | 'route' | 'share' | 'other';

const tabs: { key: TabKey; label: string; emoji: string }[] = [
  { key: 'data', label: 'Data', emoji: '🗂️' },
  { key: 'layers', label: 'Layers', emoji: '🗺️' },
  { key: 'vector', label: 'Vector Ops', emoji: '⚡' },
  { key: 'weather', label: 'Weather', emoji: '⛅' },
  { key: 'route', label: 'Route', emoji: '➡️' },
  { key: 'share', label: 'Share', emoji: '🔗' },
  { key: 'other', label: 'Other', emoji: '🧰' }
];

export default function App() {
  const [selectedTab, setSelectedTab] = useState<TabKey>('data');

  const renderContent = () => {
    switch (selectedTab) {
      case 'data':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <DataUpload />
            <DataManagement />
          </div>
        );
      case 'layers':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <MyDatasets />
            <LeafletBasemaps />
          </div>
        );
      case 'vector':
        return <VectorOperations />;
      case 'weather':
        return <Placeholder title="Weather" />;
      case 'route':
        return <Placeholder title="Route" />;
      case 'share':
        return <Placeholder title="Share" />;
      case 'other':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SmartFiltering />
            <ProfessionalFilters />
            <AdvancedQueries />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', background: '#f6f8fb' }}>
      <aside
        style={{
          width: 220,
          borderRight: '1px solid rgba(0,0,0,0.06)',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          padding: 12,
          gap: 8
        }}
      >
        <div style={{ fontWeight: 700, color: '#0f172a', padding: '8px 8px 12px 8px' }}>Control Panel</div>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setSelectedTab(t.key)}
            style={{
              textAlign: 'left',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.08)',
              background: selectedTab === t.key ? '#0f172a' : '#ffffff',
              color: selectedTab === t.key ? '#ffffff' : '#0f172a',
              cursor: 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span aria-hidden>{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </aside>

      <main style={{ flex: 1, padding: 20, overflow: 'auto' }}>
        {renderContent()}
      </main>
    </div>
  );
}

