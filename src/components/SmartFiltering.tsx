import React from 'react';

interface SmartFilteringProps {
  smartFilters: any[];
  isFilteringActive: boolean;
  queryAttributes: string[];
  queryResults: any;
  onUpdateSmartFilters: (filters: any[]) => void;
  onClearSmartFilters: () => void;
  log: (message: string, isError?: boolean) => void;
}

export const SmartFiltering: React.FC<SmartFilteringProps> = ({
  smartFilters,
  isFilteringActive,
  queryAttributes,
  queryResults,
  onUpdateSmartFilters,
  onClearSmartFilters,
  log
}) => {
  const addFilter = () => {
    const newFilters = [...smartFilters, { attribute: '', operator: '=', value: '' }];
    onUpdateSmartFilters(newFilters);
  };

  const updateFilter = (index: number, field: string, value: string) => {
    const newFilters = [...smartFilters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    onUpdateSmartFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    const newFilters = smartFilters.filter((_, i) => i !== index);
    onUpdateSmartFilters(newFilters);
  };

  const applyFilters = () => {
    onUpdateSmartFilters(smartFilters);
    log(`🔍 Applied ${smartFilters.length} smart filters`);
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
        🎯 Smart Attribute Filtering
      </h3>

      <div style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        margin: '15px 0'
      }}>
        <div style={{ fontSize: '13px', marginBottom: '10px' }}>
          <strong>🔍 Smart Filtering:</strong> Filter features in real-time without modifying the original data. 
          Only affects map display, charts, and data table.
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
            onClick={onClearSmartFilters}
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
            🗑️ Clear All
          </button>
        </div>

        <div style={{
          background: isFilteringActive ? 'rgba(46, 204, 113, 0.3)' : 'rgba(255, 255, 255, 0.2)',
          padding: '10px',
          borderRadius: '6px',
          fontSize: '13px'
        }}>
          {isFilteringActive ? (
            <>
              ✅ Smart filtering active<br />
              <small>Showing filtered features on map</small>
            </>
          ) : (
            'No filters applied - showing all features'
          )}
        </div>
      </div>

      {/* Smart Filter Builder */}
      {smartFilters.length > 0 && (
        <div style={{
          background: '#e8f4fd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#2c3e50' }}>
            🔍 Active Filters
          </h4>

          {smartFilters.map((filter, index) => (
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

          <button
            onClick={applyFilters}
            style={{
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              width: '100%'
            }}
          >
            🔍 Apply Smart Filters
          </button>
        </div>
      )}

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
                    const newFilters = [{ attribute: attr, operator: '=', value: value }];
                    onUpdateSmartFilters(newFilters);
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
    </div>
  );
};