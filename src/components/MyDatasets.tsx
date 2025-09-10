import React from 'react';

interface Dataset {
  id: number;
  name: string;
  description?: string;
  file_format?: string;
  created_at: string;
  features?: number;
}

interface MyDatasetsProps {
  datasets: Dataset[];
  selectedDataset: Dataset | null;
  datasetId: string;
  currentUser: any;
  onDatasetSelect: (dataset: Dataset) => void;
  onDatasetIdChange: (id: string) => void;
  onLoadMyDatasets: () => void;
  onDisplayDataset: () => void;
  onGetStats: () => void;
  onGetDatasetSchema: () => void;
  onClearMap: () => void;
  onClearDrawnItems: () => void;
  log: (message: string, isError?: boolean) => void;
}

export const MyDatasets: React.FC<MyDatasetsProps> = ({
  datasets,
  selectedDataset,
  datasetId,
  currentUser,
  onDatasetSelect,
  onDatasetIdChange,
  onLoadMyDatasets,
  onDisplayDataset,
  onGetStats,
  onGetDatasetSchema,
  onClearMap,
  onClearDrawnItems,
  log
}) => {
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
        📊 My Datasets
      </h3>

      <button
        onClick={onLoadMyDatasets}
        style={{
          background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)',
          color: 'white',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '500',
          width: '100%',
          fontSize: '14px',
          marginBottom: '15px'
        }}
      >
        📋 Load My Datasets
      </button>

      {datasets.length > 0 && (
        <div style={{
          maxHeight: '200px',
          overflowY: 'auto',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '10px',
          background: '#f8f9fa',
          marginBottom: '15px'
        }}>
          {datasets.map(dataset => (
            <div
              key={dataset.id}
              onClick={() => onDatasetSelect(dataset)}
              style={{
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '8px',
                background: selectedDataset?.id === dataset.id ? '#ebf3fd' : 'white',
                border: selectedDataset?.id === dataset.id ? '2px solid #3498db' : '1px solid #e9ecef',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                {dataset.name}
              </div>
              <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                ID: {dataset.id} • Format: {dataset.file_format || 'Unknown'} •
                Created: {new Date(dataset.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          color: '#2c3e50',
          fontWeight: '500',
          fontSize: '14px'
        }}>Or enter Dataset ID manually:</label>
        <input
          type="text"
          value={datasetId}
          onChange={(e) => onDatasetIdChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e9ecef',
            borderRadius: '8px',
            fontSize: '14px'
          }}
          placeholder="Dataset ID"
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button
          onClick={onDisplayDataset}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '13px'
          }}
        >
          🗺️ Show
        </button>
        <button
          onClick={onGetStats}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '13px'
          }}
        >
          📈 Stats
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button
          onClick={onGetDatasetSchema}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '13px'
          }}
        >
          🔍 Get Schema
        </button>
        <button
          onClick={() => {
            if (datasetId) {
              log(`🎯 Loading dataset ${datasetId} for smart filtering...`);
              // Add smart filtering load logic here
            } else {
              log('❌ Please select a dataset first', true);
            }
          }}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '13px'
          }}
        >
          🎯 Load for Smart Filtering
        </button>
      </div>

      <button
        onClick={onClearMap}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          color: 'white',
          border: 'none',
          padding: '8px 15px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '13px'
        }}
      >
        🗑️ Clear Map
      </button>

      <button
        onClick={onClearDrawnItems}
        style={{
          width: '100%',
          marginTop: '10px',
          background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
          color: 'white',
          border: 'none',
          padding: '8px 15px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '13px'
        }}
      >
        🧹 Clear Drawn Items
      </button>
    </div>
  );
};