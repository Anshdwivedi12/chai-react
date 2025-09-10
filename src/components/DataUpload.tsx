import React from 'react';
import { DataUploadPanel } from './DataUploadPanel';

interface DataUploadProps {
  datasets: any[];
  rasterDatasets: any[];
  onDatasetSelect: (dataset: any) => void;
  onDatasetLoad: () => void;
  onRasterDatasetSelect: (rasterDataset: any) => void;
  onRasterDatasetLoad: (rasterDataset: any) => void;
  onDataRefresh: () => void;
  currentUser: any;
}

export const DataUpload: React.FC<DataUploadProps> = ({
  datasets,
  rasterDatasets,
  onDatasetSelect,
  onDatasetLoad,
  onRasterDatasetSelect,
  onRasterDatasetLoad,
  onDataRefresh,
  currentUser
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
        📤 Data Upload
      </h3>
      
      <div style={{
        background: 'white',
        borderRadius: '10px',
        padding: '20px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <DataUploadPanel
          datasets={datasets}
          rasterDatasets={rasterDatasets}
          onDatasetSelect={onDatasetSelect}
          onDatasetLoad={onDatasetLoad}
          onRasterDatasetSelect={onRasterDatasetSelect}
          onRasterDatasetLoad={onRasterDatasetLoad}
          onDataRefresh={onDataRefresh}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};