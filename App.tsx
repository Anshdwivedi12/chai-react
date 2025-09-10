import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, AreaChart, Area
} from 'recharts';
import { DataUploadPanel } from './components/DataUploadPanel';
import { RasterManager } from './components/RasterManager';

// Import new modular components
import { DataUpload } from './src/components/DataUpload';
import { DataManagement } from './src/components/DataManagement';
import { MyDatasets } from './src/components/MyDatasets';
import { LeafletBasemaps } from './src/components/LeafletBasemaps';
import { VectorOperations } from './src/components/VectorOperations';
import { SmartFiltering } from './src/components/SmartFiltering';
import { AdvancedQueries } from './src/components/AdvancedQueries';
import { ProfessionalDashboard } from './src/components/ProfessionalDashboard';

// Import leaflet-draw dynamically to avoid optimization issues
import 'leaflet-draw/dist/leaflet.draw.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Dataset {
  id: number;
  name: string;
  description?: string;
  file_format?: string;
  created_at: string;
  features?: number;
}

interface RasterDataset {
  id: number;
  name: string;
  description?: string;
  s3_key: string;
  web_s3_key?: string;
  width?: number;
  height?: number;
  band_count?: number;
  data_type?: string;
  crs?: string;
  bounding_box: any;
  created_at: string;
}

const API_BASE_URL = 'http://localhost:8000';

export default function App() {
  // Navigation state
  const [selectedTab, setSelectedTab] = useState<'data' | 'layers' | 'vector' | 'weather' | 'route' | 'share' | 'other'>('data');

  // Authentication
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('');

  // Data Management
  const [datasets, setDatasets] = useState([]);
  const [rasterDatasets, setRasterDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [datasetId, setDatasetId] = useState('');

  // Map and Layers
  const mapRef = useRef(null);
  const [currentLayers, setCurrentLayers] = useState(new Map());
  const [currentRasterLayers, setCurrentRasterLayers] = useState(new Map());
  const [selectedFeatures, setSelectedFeatures] = useState(new Map());
  const [selectionMode, setSelectionMode] = useState(false);
  const selectionModeRef = useRef(false);

  // Vector Operations
  const [operationType, setOperationType] = useState('buffer');
  const [operationScope, setOperationScope] = useState('whole_layer');
  const [resultName, setResultName] = useState('');
  const [targetId, setTargetId] = useState('');
  const [showTargetField, setShowTargetField] = useState(false);

  // Advanced Query System
  const [queryType, setQueryType] = useState('attribute');
  const [queryResults, setQueryResults] = useState(null);
  const [showQueryPanel, setShowQueryPanel] = useState(false);
  const [customSQL, setCustomSQL] = useState('');
  const [queryAttributes, setQueryAttributes] = useState([]);
  const [selectedXAxis, setSelectedXAxis] = useState('');
  const [selectedYAxis, setSelectedYAxis] = useState('');
  const [selectedColorAxis, setSelectedColorAxis] = useState('');
  const [chartType, setChartType] = useState('bar');

  // Pagination for query results
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Enhanced Query Filters
  const [attributeFilters, setAttributeFilters] = useState([]);
  const [spatialQueryGeometry, setSpatialQueryGeometry] = useState(null);
  const [spatialRelation, setSpatialRelation] = useState('intersects');
  const [drawnLayer, setDrawnLayer] = useState(null);
  const [drawControl, setDrawControl] = useState(null);
  const [drawnItems, setDrawnItems] = useState<L.FeatureGroup | null>(null);
  const [pollingTimeout, setPollingTimeout] = useState<number | null>(null);

  // Smart Filtering System
  const [smartFilters, setSmartFilters] = useState([]);
  const [filteredFeatures, setFilteredFeatures] = useState(new Map());
  const [originalFeatures, setOriginalFeatures] = useState(new Map());
  const [isFilteringActive, setIsFilteringActive] = useState(false);

  // UI: Control Panel visibility
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Logging
  const [logMessages, setLogMessages] = useState([
    '🚀 MapZest Platform Ready',
    '💡 Login and load your datasets to start analyzing'
  ]);

  const log = (message: string, isError = false) => {
    const timestamp = new Date().toLocaleTimeString();
    const entry = `[${timestamp}] ${message}`;
    setLogMessages(prev => [...prev, entry]);

    if (isError) {
      console.error(message);
    } else {
      console.log(message);
    }
  };

  // Navigation tabs configuration
  const navigationTabs = [
    { id: 'data', label: '📊 Data', icon: '📊' },
    { id: 'layers', label: '🗺️ Layers', icon: '🗺️' },
    { id: 'vector', label: '⚡ Vector Operations', icon: '⚡' },
    { id: 'weather', label: '🌤️ Weather', icon: '🌤️' },
    { id: 'route', label: '🚗 Route', icon: '🚗' },
    { id: 'share', label: '📤 Share', icon: '📤' },
    { id: 'other', label: '🔧 Other', icon: '🔧' }
  ] as const;

  // Initialize Map and other effects would go here...
  useEffect(() => {
    const initializeMap = async () => {
      const map = L.map('map').setView([40.7128, -74.0060], 3);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      mapRef.current = map;
      log('🗺️ Map initialized');
    };

    initializeMap();

    return () => {
      if (pollingTimeout) {
        clearTimeout(pollingTimeout);
      }
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Authentication functions
  const login = async () => {
    if (!email || !password) {
      log('❌ Please enter email and password', true);
      return;
    }

    log('🔄 Logging in...');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      setShowLoginModal(false);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 1800);
      log('✅ Login successful!');
    } catch (error: any) {
      log('❌ Login failed: ' + error.message, true);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setDatasets([]);
      setRasterDatasets([]);
      setSelectedDataset(null);
      setDatasetId('');
      log('👋 Logged out successfully');
      setShowUserMenu(false);
    } catch (error: any) {
      log('❌ Logout failed: ' + error.message, true);
    }
  };

  // Data management functions (simplified versions)
  const loadMyDatasets = async () => {
    if (!currentUser) {
      log('❌ Please login first', true);
      return;
    }
    log('📋 Loading your datasets...');
    // Add API calls here
  };

  const selectDataset = (dataset: Dataset) => {
    setSelectedDataset(dataset);
    setDatasetId(dataset.id.toString());
    log(`📌 Selected dataset: ${dataset.name} (ID: ${dataset.id})`);
  };

  const displayDataset = async () => {
    if (!datasetId || !currentUser) {
      log('❌ Please select dataset and login first', true);
      return;
    }
    log(`🔄 Loading dataset ${datasetId}...`);
    // Add display logic here
  };

  const getStats = async () => {
    log(`📊 Getting statistics for dataset ${datasetId}...`);
    // Add stats logic here
  };

  const getDatasetSchema = async () => {
    log(`🔍 Getting schema for dataset ${datasetId}...`);
    // Add schema logic here
  };

  const clearMap = () => {
    log('🗺️ Map cleared');
    // Add clear logic here
  };

  const clearDrawnItems = () => {
    log('🧹 Drawn items cleared');
    // Add clear drawn items logic here
  };

  // Vector operations functions
  const runOperation = async () => {
    log(`⚡ Running ${operationType} operation...`);
    // Add operation logic here
  };

  const useSameDataset = () => {
    if (!datasetId) {
      log('❌ Please select a source dataset first', true);
      return;
    }
    setTargetId(datasetId);
    log(`✅ Set target to same dataset (ID: ${datasetId})`);
  };

  const stopPolling = () => {
    if (pollingTimeout) {
      clearTimeout(pollingTimeout);
      setPollingTimeout(null);
      log('🛑 Polling stopped manually');
    }
  };

  // Query functions
  const executeAdvancedQuery = async () => {
    log(`🔍 Executing ${queryType} query...`);
    // Add query logic here
  };

  const clearQueryResults = () => {
    setQueryResults(null);
    setCurrentPage(1);
    log('🗑️ Query results cleared');
  };

  // Smart filtering functions
  const updateSmartFilters = (newFilters: any[]) => {
    setSmartFilters(newFilters);
    log(`🔍 Smart filters updated: ${newFilters.length} filters`);
  };

  const clearSmartFilters = () => {
    setSmartFilters([]);
    setIsFilteringActive(false);
    log('🔍 Smart filters cleared');
  };

  // Render content based on selected tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'data':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <DataUpload
              datasets={datasets}
              rasterDatasets={rasterDatasets}
              onDatasetSelect={selectDataset}
              onDatasetLoad={displayDataset}
              onRasterDatasetSelect={selectDataset}
              onRasterDatasetLoad={displayDataset}
              onDataRefresh={loadMyDatasets}
              currentUser={currentUser}
            />
            <DataManagement
              currentUser={currentUser}
              log={log}
            />
          </div>
        );

      case 'layers':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <MyDatasets
              datasets={datasets}
              selectedDataset={selectedDataset}
              datasetId={datasetId}
              currentUser={currentUser}
              onDatasetSelect={selectDataset}
              onDatasetIdChange={setDatasetId}
              onLoadMyDatasets={loadMyDatasets}
              onDisplayDataset={displayDataset}
              onGetStats={getStats}
              onGetDatasetSchema={getDatasetSchema}
              onClearMap={clearMap}
              onClearDrawnItems={clearDrawnItems}
              log={log}
            />
            <LeafletBasemaps
              map={mapRef.current}
              log={log}
            />
          </div>
        );

      case 'vector':
        return (
          <VectorOperations
            operationType={operationType}
            operationScope={operationScope}
            resultName={resultName}
            targetId={targetId}
            showTargetField={showTargetField}
            selectedFeatures={selectedFeatures}
            datasetId={datasetId}
            currentUser={currentUser}
            onOperationTypeChange={setOperationType}
            onOperationScopeChange={setOperationScope}
            onResultNameChange={setResultName}
            onTargetIdChange={setTargetId}
            onUseSameDataset={useSameDataset}
            onRunOperation={runOperation}
            onLoadMyDatasets={loadMyDatasets}
            onStopPolling={stopPolling}
            log={log}
          />
        );

      case 'weather':
        return (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#7f8c8d',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <h3>🌤️ Weather Features</h3>
            <p>Weather integration coming soon...</p>
          </div>
        );

      case 'route':
        return (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#7f8c8d',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <h3>🚗 Route Planning</h3>
            <p>Route planning features coming soon...</p>
          </div>
        );

      case 'share':
        return (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#7f8c8d',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <h3>📤 Share & Export</h3>
            <p>Sharing and export features coming soon...</p>
          </div>
        );

      case 'other':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <SmartFiltering
              smartFilters={smartFilters}
              isFilteringActive={isFilteringActive}
              queryAttributes={queryAttributes}
              queryResults={queryResults}
              onUpdateSmartFilters={updateSmartFilters}
              onClearSmartFilters={clearSmartFilters}
              log={log}
            />
            <ProfessionalDashboard
              attributeFilters={attributeFilters}
              queryAttributes={queryAttributes}
              queryResults={queryResults}
              currentUser={currentUser}
              datasetId={datasetId}
              onAttributeFiltersChange={setAttributeFilters}
              onExecuteAdvancedQuery={executeAdvancedQuery}
              log={log}
            />
            <AdvancedQueries
              showQueryPanel={showQueryPanel}
              queryType={queryType}
              spatialRelation={spatialRelation}
              spatialQueryGeometry={spatialQueryGeometry}
              customSQL={customSQL}
              queryAttributes={queryAttributes}
              attributeFilters={attributeFilters}
              currentUser={currentUser}
              datasetId={datasetId}
              onToggleQueryPanel={() => setShowQueryPanel(!showQueryPanel)}
              onQueryTypeChange={setQueryType}
              onSpatialRelationChange={setSpatialRelation}
              onCustomSQLChange={setCustomSQL}
              onAttributeFiltersChange={setAttributeFilters}
              onExecuteAdvancedQuery={executeAdvancedQuery}
              onClearQueryResults={clearQueryResults}
              log={log}
            />
          </div>
        );

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div style={{
      background: 'transparent',
      padding: '0px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '4000px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: `${isControlPanelOpen ? '450px' : '0px'} 1fr 300px`,
        gridTemplateRows: 'auto 1fr',
        gap: '0px',
        height: '100vh'
      }}>

        {/* Navbar */}
        <div style={{
          gridColumn: '1 / -1',
          width: '100%',
          background: '#f6f9fb',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          padding: '6px 12px',
          borderRadius: '2px',
          display: 'flex',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 48,
        }}>
          {/* Left: menu + brand */}
          <button aria-label="Menu" onClick={() => setIsControlPanelOpen(v => !v)} style={{
            height: 32,
            width: 32,
            borderRadius: 6,
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>Mapzest Express</span>
            <span style={{ fontSize: 12, color: '#64748b' }}>Advanced</span>
          </div>
          
          {/* Center: spacer */}
          <div style={{ flex: 1 }} />

          {/* Profile icon */}
          <button
            aria-label="Profile"
            onClick={() => {
              if (currentUser) {
                setShowUserMenu(v => !v);
              } else {
                setShowLoginModal(true);
              }
            }}
            style={{
              height: 32,
              width: 32,
              borderRadius: '50%',
              background: currentUser ? '#22c55e' : '#ef4444',
              border: '1px solid rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              fontWeight: 700
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21a8 8 0 1 0-16 0"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </button>

          {/* User dropdown when logged in */}
          {currentUser && showUserMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 40,
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}>
              <button onClick={logout} style={{
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                width: 160,
                textAlign: 'left'
              }}>Logout</button>
            </div>
          )}
        </div>

        {/* Control Panel with Tab Navigation */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          overflowY: 'auto',
          display: isControlPanelOpen ? 'block' : 'none'
        }}>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '30px',
            borderBottom: '1px solid #ecf0f1',
            paddingBottom: '25px'
          }}>
            <h3 style={{
              color: '#2c3e50',
              marginBottom: '15px',
              fontSize: '22px',
              fontWeight: 600
            }}>
              Navigation
            </h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {navigationTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: selectedTab === tab.id ? '#2c3e50' : '#f8f9fa',
                    color: selectedTab === tab.id ? '#ffffff' : '#2c3e50',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '14px',
                    gap: '10px',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label.replace(tab.icon + ' ', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {renderTabContent()}
          </div>
        </div>

        {/* Map */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          position: 'relative'
        }}>
          <div id="map" style={{ height: '100%', width: '100%' }}></div>
        </div>

        {/* Status/Log Panel */}
        <div style={{
          background: '#2c3e50',
          color: '#ecf0f1',
          padding: '20px',
          fontFamily: "'Monaco', 'Courier New', monospace",
          fontSize: '12px',
          lineHeight: '1.5',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          borderRadius: '15px'
        }}>
          <div style={{ marginBottom: '10px', color: '#ecf0f1', fontWeight: 'bold' }}>📋 System Log</div>
          {logMessages.slice(-50).map((message, index) => (
            <div key={index} style={{ marginBottom: '2px' }}>{message}</div>
          ))}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && !currentUser && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            width: 360,
            background: '#ffffff',
            borderRadius: 12,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            padding: 20
          }}>
            <h3 style={{ marginTop: 0, marginBottom: 12 }}>Login</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8 }} 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{ padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8 }} 
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={login} 
                  style={{ 
                    flex: 1, 
                    padding: '10px 12px', 
                    background: '#2563eb', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 8, 
                    cursor: 'pointer' 
                  }}
                >
                  Login
                </button>
                <button 
                  onClick={() => setShowLoginModal(false)} 
                  style={{ 
                    padding: '10px 12px', 
                    background: '#f3f4f6', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: 8, 
                    cursor: 'pointer' 
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {showSuccessAlert && (
        <div style={{
          position: 'fixed',
          left: '50%',
          top: '15%',
          transform: 'translate(-50%, -50%)',
          background: '#ecfdf5',
          color: '#065f46',
          border: '1px solid #a7f3d0',
          borderRadius: 12,
          padding: '12px 16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}>
          ✅ Logged in successfully
        </div>
      )}

      {/* Raster Manager Panel */}
      {currentUser && mapRef.current && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          maxHeight: '70vh',
          maxWidth: '350px',
          overflowY: 'auto',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <RasterManager 
            map={mapRef.current}
            apiBaseUrl={API_BASE_URL}
          />
        </div>
      )}
    </div>
  );
}