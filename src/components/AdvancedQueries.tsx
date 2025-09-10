import React from 'react';

interface AdvancedQueriesProps {
  showQueryPanel: boolean;
  queryType: string;
  spatialRelation: string;
  spatialQueryGeometry: any;
  customSQL: string;
  queryAttributes: string[];
  attributeFilters: any[];
  currentUser: any;
  datasetId: string;
  onToggleQueryPanel: () => void;
  onQueryTypeChange: (type: string) => void;
  onSpatialRelationChange: (relation: string) => void;
  onCustomSQLChange: (sql: string) => void;
  onAttributeFiltersChange: (filters: any[]) => void;
  onExecuteAdvancedQuery: () => void;
  onClearQueryResults: () => void;
  log: (message: string, isError?: boolean) => void;
}

export const AdvancedQueries: React.FC<AdvancedQueriesProps> = ({
  showQueryPanel,
  queryType,
  spatialRelation,
  spatialQueryGeometry,
  customSQL,
  queryAttributes,
  attributeFilters,
  currentUser,
  datasetId,
  onToggleQueryPanel,
  onQueryTypeChange,
  onSpatialRelationChange,
  onCustomSQLChange,
  onAttributeFiltersChange,
  onExecuteAdvancedQuery,
  onClearQueryResults,
  log
}) => {
  const addAttributeFilter = () => {
    const newFilters = [...attributeFilters, { attribute: '', operator: '=', value: '' }];
    onAttributeFiltersChange(newFilters);
  };

  const updateAttributeFilter = (index: number, field: string, value: string) => {
    const newFilters = [...attributeFilters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    onAttributeFiltersChange(newFilters);
  };

  const removeAttributeFilter = (index: number) => {
    const newFilters = attributeFilters.filter((_, i) => i !== index);
    onAttributeFiltersChange(newFilters);
  };

  const testSpatialQuery = () => {
    if (datasetId && currentUser) {
      log('🗺️ Testing spatial query...');
      log(`📍 Sending geometry: ${JSON.stringify(spatialQueryGeometry?.geometry || spatialQueryGeometry).substring(0, 100)}...`);
      onExecuteAdvancedQuery();
    }
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
        🔍 Advanced Queries
      </h3>

      <button
        onClick={onToggleQueryPanel}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
          color: 'white',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '14px',
          marginBottom: '15px'
        }}
      >
        {showQueryPanel ? '🔍 Hide Query Panel' : '🔍 Show Query Panel'}
      </button>

      {showQueryPanel && (
        <div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#2c3e50',
              fontWeight: '500',
              fontSize: '14px'
            }}>Query Type:</label>
            <select
              value={queryType}
              onChange={(e) => onQueryTypeChange(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="attribute">📊 Attribute Query</option>
              <option value="spatial">🗺️ Spatial Query</option>
              <option value="statistical">📈 Statistical Query</option>
              <option value="custom">💻 Custom SQL</option>
            </select>
          </div>

          {/* Spatial Query Controls */}
          {queryType === 'spatial' && (
            <div style={{
              marginBottom: '15px',
              padding: '15px',
              background: '#e8f4fd',
              borderRadius: '8px',
              border: '1px solid #3498db'
            }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#2c3e50' }}>
                🗺️ Spatial Query Settings
              </h4>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#2c3e50'
                }}>
                  Spatial Relationship:
                </label>
                <select
                  value={spatialRelation || 'intersects'}
                  onChange={(e) => onSpatialRelationChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  <option value="intersects">Intersects (overlaps)</option>
                  <option value="contains">Contains (completely inside)</option>
                  <option value="within">Within (completely contained by)</option>
                  <option value="touches">Touches (boundary contact)</option>
                  <option value="crosses">Crosses (passes through)</option>
                  <option value="overlaps">Overlaps (partial overlap)</option>
                  <option value="disjoint">Disjoint (no contact)</option>
                </select>
              </div>
              
              <div style={{
                padding: '8px',
                background: '#f8f9fa',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#6c757d'
              }}>
                <strong>📝 How to Use Spatial Queries:</strong><br />
                1. <strong>Draw Geometry:</strong> Use draw tools (top-right corner of map)<br />
                2. <strong>Choose Relationship:</strong> Select how features should relate to your geometry<br />
                3. <strong>Execute Query:</strong> Click "Execute Query" or "Test Spatial" button<br />
                <br />
                <strong>💡 Tip:</strong> Try different spatial relationships to see different results!
              </div>
              
              {spatialQueryGeometry && (
                <div style={{
                  marginTop: '10px',
                  padding: '8px',
                  background: '#d4edda',
                  borderRadius: '4px',
                  fontSize: '11px',
                  color: '#155724'
                }}>
                  ✅ Geometry ready: {spatialQueryGeometry.geometry.type}
                  <br />
                  <button
                    onClick={testSpatialQuery}
                    style={{
                      marginTop: '5px',
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '10px'
                    }}
                  >
                    🚀 Test Spatial Query
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Attribute Query Filters */}
          {queryType === 'attribute' && queryAttributes.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#2c3e50',
                fontWeight: '500',
                fontSize: '14px'
              }}>Available Attributes:</label>
              <div style={{
                maxHeight: '100px',
                overflow: 'auto',
                background: '#f8f9fa',
                padding: '10px',
                borderRadius: '6px',
                fontSize: '12px',
                marginBottom: '10px'
              }}>
                {queryAttributes.map(attr => (
                  <span key={attr} style={{
                    display: 'inline-block',
                    background: '#e9ecef',
                    padding: '2px 6px',
                    margin: '2px',
                    borderRadius: '4px',
                    fontSize: '11px'
                  }}>
                    {attr}
                  </span>
                ))}
              </div>

              {/* Attribute Filter Builder */}
              <div style={{
                background: '#e8f4fd',
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '10px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#2c3e50' }}>
                  🔍 Build Attribute Filters
                </h4>

                {attributeFilters && attributeFilters.map((filter, index) => (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr auto',
                    gap: '8px',
                    marginBottom: '8px',
                    alignItems: 'center'
                  }}>
                    <select
                      value={filter?.attribute || ''}
                      onChange={(e) => updateAttributeFilter(index, 'attribute', e.target.value)}
                      style={{
                        padding: '6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      <option value="">Select Attribute</option>
                      {queryAttributes && queryAttributes.map(attr => (
                        <option key={attr} value={attr}>{attr}</option>
                      ))}
                    </select>

                    <select
                      value={filter?.operator || '='}
                      onChange={(e) => updateAttributeFilter(index, 'operator', e.target.value)}
                      style={{
                        padding: '6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      <option value="=">Equals (=)</option>
                      <option value="contains">Contains</option>
                      <option value="starts_with">Starts With</option>
                      <option value="ends_with">Ends With</option>
                      <option value=">">Greater Than (&gt;)</option>
                      <option value="<">Less Than (&lt;)</option>
                      <option value=">=">Greater or Equal (&gt;=)</option>
                      <option value="<=">Less or Equal (&lt;=)</option>
                      <option value="between">Between (min,max)</option>
                    </select>

                    <input
                      type="text"
                      value={filter?.value || ''}
                      onChange={(e) => updateAttributeFilter(index, 'value', e.target.value)}
                      placeholder="Value"
                      style={{
                        padding: '6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    />

                    <button
                      onClick={() => removeAttributeFilter(index)}
                      style={{
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}

                <button
                  onClick={addAttributeFilter}
                  style={{
                    background: '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    width: '100%'
                  }}
                >
                  + Add Filter
                </button>
              </div>
            </div>
          )}

          {queryType === 'custom' && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#2c3e50',
                fontWeight: '500',
                fontSize: '14px'
              }}>SQL Query:</label>
              <textarea
                value={customSQL}
                onChange={(e) => onCustomSQLChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '14px',
                  height: '100px',
                  fontFamily: 'monospace'
                }}
                placeholder="SELECT * FROM features WHERE..."
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onExecuteAdvancedQuery}
              disabled={!currentUser}
              style={{
                flex: 1,
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
              🔍 Execute Query
            </button>

            <button
              onClick={onClearQueryResults}
              style={{
                background: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              🗑️ Clear Results
            </button>
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
              ⚠️ Please login to execute advanced queries
            </div>
          )}
        </div>
      )}
    </div>
  );
};