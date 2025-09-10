import React from 'react';

interface ProfessionalDashboardProps {
  attributeFilters: any[];
  queryAttributes: string[];
  queryResults: any;
  currentUser: any;
  datasetId: string;
  onAttributeFiltersChange: (filters: any[]) => void;
  onExecuteAdvancedQuery: () => void;
  log: (message: string, isError?: boolean) => void;
}

export const ProfessionalDashboard: React.FC<ProfessionalDashboardProps> = ({
  attributeFilters,
  queryAttributes,
  queryResults,
  currentUser,
  datasetId,
  onAttributeFiltersChange,
  onExecuteAdvancedQuery,
  log
}) => {
  const addFilter = () => {
    const newFilters = [...attributeFilters, { attribute: '', operator: '=', value: '' }];
    onAttributeFiltersChange(newFilters);
  };

  const updateFilter = (index: number, field: string, value: string) => {
    const newFilters = [...attributeFilters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    onAttributeFiltersChange(newFilters);
  };

  const removeFilter = (index: number) => {
    const newFilters = attributeFilters.filter((_, i) => i !== index);
    onAttributeFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onAttributeFiltersChange([]);
    // Re-execute query without filters
    if (datasetId && currentUser) {
      onExecuteAdvancedQuery();
    }
  };

  const testBasicQuery = async () => {
    onAttributeFiltersChange([]);
    if (datasetId && currentUser) {
      log('🧪 Testing basic query...');
      onExecuteAdvancedQuery();
    }
  };

  const inspectData = () => {
    if (queryResults && queryResults.data && queryResults.data.length > 0) {
      log('🔍 INSPECTING DATA VALUES:');
      const sample = queryResults.data.slice(0, 5);
      sample.forEach((item: any, index: number) => {
        log(`📊 Sample ${index + 1}:`);
        Object.entries(item).forEach(([key, value]) => {
          if (key !== 'geometry') {
            log(`  ${key}: "${value}" (type: ${typeof value})`);
          }
        });
      });
      
      // Show unique values for each attribute
      const attributes = Object.keys(queryResults.data[0]).filter((k: string) => k !== 'geometry' && k !== 'id');
      attributes.forEach(attr => {
        const uniqueValues = [...new Set(queryResults.data.map((item: any) => item[attr]))].slice(0, 10);
        log(`🎯 Unique values for ${attr}: ${uniqueValues.map(v => `"${v}"`).join(', ')}`);
      });
    } else {
      log('⚠️ No query results available to inspect', true);
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
        📊 Professional Dashboard Filters
      </h3>

      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        margin: '15px 0'
      }}>
        <div style={{ fontSize: '13px', marginBottom: '10px' }}>
          <strong>🎯 Power BI-like Experience:</strong> Create professional filters that work across all visualizations. 
          Filters are applied in real-time to query results, map, charts, and data table.
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button
            onClick={addFilter}
            style={{
              background: '#27ae60',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '13px'
            }}
          >
            + Add Filter
          </button>
          <button
            onClick={clearAllFilters}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '13px'
            }}
          >
            🗑️ Clear All Filters
          </button>
        </div>

        <div style={{
          background: attributeFilters.length > 0 ? 'rgba(46, 204, 113, 0.3)' : 'rgba(255, 255, 255, 0.2)',
          padding: '10px',
          borderRadius: '6px',
          fontSize: '13px'
        }}>
          {attributeFilters.length > 0 ? (
            <>
              ✅ {attributeFilters.length} active filter(s)<br />
              <small>Filters applied to query results and all visualizations</small>
            </>
          ) : (
            'No filters applied - showing all data'
          )}
        </div>
      </div>

      {/* Professional Filter Builder */}
      {attributeFilters.length > 0 && (
        <div style={{
          background: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '15px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#2c3e50' }}>
            🔍 Active Dashboard Filters
          </h4>

          {attributeFilters.map((filter, index) => (
            <div key={index} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr auto',
              gap: '8px',
              marginBottom: '8px',
              alignItems: 'center'
            }}>
              <select
                value={filter.attribute || ''}
                onChange={(e) => updateFilter(index, 'attribute', e.target.value)}
                style={{
                  padding: '8px',
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
                value={filter.operator || '='}
                onChange={(e) => updateFilter(index, 'operator', e.target.value)}
                style={{
                  padding: '8px',
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
                value={filter.value || ''}
                onChange={(e) => updateFilter(index, 'value', e.target.value)}
                placeholder="Value"
                style={{
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              />

              <button
                onClick={() => removeFilter(index)}
                style={{
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ×
              </button>
            </div>
          ))}

          {/* Quick Filter Presets */}
          {queryResults && queryResults.data && queryResults.data.length > 0 && queryAttributes && queryAttributes.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#2c3e50' }}>
                ⚡ Quick Filter Presets
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {queryAttributes.slice(0, 3).map(attr => {
                  // Get unique values for this attribute
                  const uniqueValues = [...new Set(queryResults.data.map((item: any) => item[attr]))].slice(0, 3);
                  return uniqueValues.map(value => (
                    <button
                      key={`${attr}-${value}`}
                      onClick={() => {
                        onAttributeFiltersChange([{ attribute: attr, operator: '=', value: value }]);
                        log(`⚡ Applied quick filter: ${attr} = "${value}"`);
                      }}
                      style={{
                        background: '#f39c12',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}
                    >
                      {attr}: {String(value).substring(0, 15)}
                    </button>
                  ));
                })}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={inspectData}
              style={{
                flex: 1,
                background: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              🔍 Inspect Data
            </button>
            <button
              onClick={testBasicQuery}
              style={{
                flex: 1,
                background: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              🚀 Super Simple Test
            </button>
            <button
              onClick={() => {
                // Re-execute query with current filters
                if (datasetId && currentUser) {
                  onExecuteAdvancedQuery();
                }
              }}
              style={{
                flex: 1,
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              🔄 Apply Filters & Refresh Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};