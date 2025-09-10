import React from 'react';

interface DataManagementProps {
  currentUser: any;
  log: (message: string, isError?: boolean) => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({ currentUser, log }) => {
  const handleDataImport = () => {
    log('🔄 Starting data import process...');
    // Add data import logic here
  };

  const handleDataExport = () => {
    log('📤 Starting data export process...');
    // Add data export logic here
  };

  const handleDataTransformation = () => {
    log('🔄 Starting data transformation...');
    // Add data transformation logic here
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
        🗂️ Data Management
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button
          onClick={handleDataImport}
          disabled={!currentUser}
          style={{
            background: currentUser 
              ? 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)' 
              : '#95a5a6',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: currentUser ? 'pointer' : 'not-allowed',
            fontWeight: '500',
            fontSize: '14px'
          }}
        >
          📥 Import Data
        </button>

        <button
          onClick={handleDataExport}
          disabled={!currentUser}
          style={{
            background: currentUser 
              ? 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)' 
              : '#95a5a6',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: currentUser ? 'pointer' : 'not-allowed',
            fontWeight: '500',
            fontSize: '14px'
          }}
        >
          📤 Export Data
        </button>

        <button
          onClick={handleDataTransformation}
          disabled={!currentUser}
          style={{
            background: currentUser 
              ? 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)' 
              : '#95a5a6',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: currentUser ? 'pointer' : 'not-allowed',
            fontWeight: '500',
            fontSize: '14px'
          }}
        >
          🔄 Transform Data
        </button>

        {!currentUser && (
          <div style={{
            padding: '15px',
            background: '#f8d7da',
            borderRadius: '6px',
            color: '#721c24',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            ⚠️ Please login to access data management features
          </div>
        )}
      </div>
    </div>
  );
};