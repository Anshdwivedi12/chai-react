import React from 'react';

interface VectorOperationsProps {
  operationType: string;
  operationScope: string;
  resultName: string;
  targetId: string;
  showTargetField: boolean;
  selectedFeatures: Map<number, Set<string>>;
  datasetId: string;
  currentUser: any;
  onOperationTypeChange: (type: string) => void;
  onOperationScopeChange: (scope: string) => void;
  onResultNameChange: (name: string) => void;
  onTargetIdChange: (id: string) => void;
  onUseSameDataset: () => void;
  onRunOperation: () => void;
  onLoadMyDatasets: () => void;
  onStopPolling: () => void;
  log: (message: string, isError?: boolean) => void;
}

export const VectorOperations: React.FC<VectorOperationsProps> = ({
  operationType,
  operationScope,
  resultName,
  targetId,
  showTargetField,
  selectedFeatures,
  datasetId,
  currentUser,
  onOperationTypeChange,
  onOperationScopeChange,
  onResultNameChange,
  onTargetIdChange,
  onUseSameDataset,
  onRunOperation,
  onLoadMyDatasets,
  onStopPolling,
  log
}) => {
  const getSelectedFeaturesCount = () => {
    let total = 0;
    selectedFeatures.forEach((features) => {
      total += features.size;
    });
    return total;
  };

  const getSelectedFeaturesText = () => {
    let detailText = '';
    selectedFeatures.forEach((features, datasetId) => {
      if (features.size > 0) {
        detailText += `Dataset ${datasetId}: ${features.size} features\n`;
      }
    });
    return detailText.trim();
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
        ⚡ Vector Operations
      </h3>

      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          color: '#2c3e50',
          fontWeight: '500',
          fontSize: '14px'
        }}>Operation Type:</label>
        <select
          value={operationType}
          onChange={(e) => onOperationTypeChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e9ecef',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        >
          <option value="buffer">🔘 Buffer (create zones around features)</option>
          <option value="centroid">🎯 Centroid (find center points)</option>
          <option value="convex_hull">🔲 Convex Hull (create boundaries)</option>
          <option value="simplify">📐 Simplify (reduce complexity)</option>
          <option value="intersection">⚡ Intersection (overlapping areas)</option>
          <option value="union">🔗 Union (combine areas)</option>
          <option value="difference">➖ Difference (subtract areas)</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          color: '#2c3e50',
          fontWeight: '500',
          fontSize: '14px'
        }}>Apply to:</label>
        <select
          value={operationScope}
          onChange={(e) => onOperationScopeChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e9ecef',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        >
          <option value="whole_layer">🌍 Entire Dataset (All Features)</option>
          <option value="selected_features">🎯 Only Selected Features (Click features on map first)</option>
        </select>
        <div style={{
          fontSize: '12px',
          color: operationScope === 'selected_features' ? '#e67e22' : '#7f8c8d',
          marginTop: '5px',
          fontStyle: 'italic'
        }}>
          {operationScope === 'selected_features'
            ? '⚠️ Make sure to enable selection mode and click features on the map first!'
            : '💡 This will process ALL features in the dataset'
          }
        </div>
        {operationScope === 'selected_features' && (
          <div style={{
            marginTop: '10px',
            padding: '10px',
            background: getSelectedFeaturesCount() === 0 ? '#f8d7da' : '#d4edda',
            borderRadius: '6px',
            fontSize: '12px',
            color: getSelectedFeaturesCount() === 0 ? '#721c24' : '#155724'
          }}>
            {getSelectedFeaturesCount() === 0 ? (
              '⚠️ No features selected. Enable selection mode and click features on the map.'
            ) : (
              <>
                ✅ {getSelectedFeaturesCount()} features selected<br />
                <small>{getSelectedFeaturesText()}</small>
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{
          display: 'block',
          marginBottom: '5px',
          color: '#2c3e50',
          fontWeight: '500',
          fontSize: '14px'
        }}>Result Name:</label>
        <input
          type="text"
          value={resultName}
          onChange={(e) => onResultNameChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e9ecef',
            borderRadius: '8px',
            fontSize: '14px'
          }}
          placeholder="Name for new layer"
        />
      </div>

      {showTargetField && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            color: '#2c3e50',
            fontWeight: '500',
            fontSize: '14px'
          }}>Target Dataset ID (for binary operations):</label>
          <input
            type="text"
            value={targetId}
            onChange={(e) => onTargetIdChange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            placeholder="Enter target dataset ID"
          />
          <div style={{
            fontSize: '12px',
            color: '#7f8c8d',
            marginTop: '5px',
            fontStyle: 'italic'
          }}>
            💡 For intersection/union/difference operations, you can use TWO different datasets OR the same dataset (self-operation)
          </div>
          <div style={{ margin: '10px 0' }}>
            <button
              onClick={onUseSameDataset}
              style={{
                background: '#3498db',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                marginRight: '10px'
              }}
            >
              🔄 Use Same Dataset (Self-Operation)
            </button>
            <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Perfect for operations between features within one dataset</span>
          </div>
        </div>
      )}

      <button
        onClick={onRunOperation}
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
          width: '100%',
          fontSize: '14px'
        }}
      >
        ⚡ Run Operation
      </button>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button
          onClick={() => {
            log('🔄 Manually refreshing datasets...');
            onLoadMyDatasets();
            log('✅ Datasets refreshed - check if new results are available');
          }}
          style={{
            background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            flex: 1,
            fontSize: '12px'
          }}
        >
          🔄 Refresh Datasets
        </button>
        
        <button
          onClick={onStopPolling}
          style={{
            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            flex: 1,
            fontSize: '12px'
          }}
        >
          🛑 Stop Polling
        </button>
      </div>

      <div style={{
        fontSize: '12px',
        color: '#7f8c8d',
        marginTop: '5px',
        fontStyle: 'italic'
      }}>
        💡 Binary operations (intersection, union, difference) require two datasets
      </div>

      {!currentUser && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          background: '#f8d7da',
          borderRadius: '6px',
          color: '#721c24',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          ⚠️ Please login to perform vector operations
        </div>
      )}
    </div>
  );
};