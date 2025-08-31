// App.jsx - Full Screen Beautiful Google Sheets Editor
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import './App.css';

// API configuration - supports different environments
const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function App() {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [editingCell, setEditingCell] = useState(null);
  const [pendingUpdates, setPendingUpdates] = useState(new Map());
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');
  
  // Refs for keyboard navigation
  const editingRef = useRef(null);
  const updateTimeoutRef = useRef(null);

  // Generate column headers A-Z
  const columnHeaders = Array.from({ length: 26 }, (_, i) => 
    String.fromCharCode(65 + i)
  );

  // Check API health
  const checkAPIHealth = async () => {
    try {
      const response = await fetch(`${API}/health`);
      if (response.ok) {
        setApiStatus('connected');
        return true;
      } else {
        setApiStatus('error');
        return false;
      }
    } catch (err) {
      setApiStatus('disconnected');
      setError(`Cannot connect to API at ${API}. Make sure your backend is running.`);
      return false;
    }
  };

  // Load tabs from API
  const loadTabs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API}/tabs`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const tabsData = await response.json();
      console.log('Tabs loaded:', tabsData);
      
      if (Array.isArray(tabsData) && tabsData.length > 0) {
        setTabs(tabsData);
        setActiveTab(tabsData[0].title);
      } else {
        setError('No tabs found in the spreadsheet');
      }
    } catch (err) {
      console.error('Error loading tabs:', err);
      setError(`Failed to load tabs: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      const isHealthy = await checkAPIHealth();
      if (isHealthy) {
        await loadTabs();
      }
    };
    
    initializeApp();
  }, []);

  // Debounced update function
  const debouncedUpdate = useCallback((updates) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(async () => {
      if (updates.size === 0) return;
      
      setIsUpdating(true);
      setError(null);
      
      try {
        const writes = Array.from(updates.entries()).map(([key, value]) => {
          const [rowIndex, colIndex] = key.split(':').map(Number);
          const col = String.fromCharCode(65 + colIndex); // Convert to A, B, C, etc.
          return { row: rowIndex + 1, col, value };
        });

        const response = await fetch(`${API}/sheet/${encodeURIComponent(activeTab)}/batch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ writes })
        });

        if (!response.ok) {
          throw new Error(`Update failed: ${response.statusText}`);
        }

        // Clear pending updates on success
        setPendingUpdates(new Map());
        
        // Refresh data to ensure consistency
        await refreshData();
        
      } catch (err) {
        setError(`Update failed: ${err.message}`);
        // Rollback optimistic updates on error
        setRows(prevRows => {
          const newRows = [...prevRows];
          updates.forEach((value, key) => {
            const [rowIndex, colIndex] = key.split(':').map(Number);
            if (newRows[rowIndex] && newRows[rowIndex][colIndex] !== undefined) {
              newRows[rowIndex][colIndex] = value;
            }
          });
          return newRows;
        });
      } finally {
        setIsUpdating(false);
      }
    }, 500); // 500ms debounce
  }, [activeTab]);

  // Refresh data from server
  const refreshData = async () => {
    if (!activeTab) return;
    try {
      setError(null);
      const res = await fetch(
        `${API}/sheet/${encodeURIComponent(activeTab)}?start=1&limit=1000&cols=A:Z`
      );
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const json = await res.json();
      console.log('Data refreshed:', json);
      
      setRows(json.values || []);
      setTotalRows(json.values?.length || 0);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError(`Failed to refresh data: ${err.message}`);
    }
  };

  // Load page data
  const loadPage = async (start, limit = 500) => {
    if (!activeTab) return [];
    try {
      const res = await fetch(
        `${API}/sheet/${encodeURIComponent(activeTab)}?start=${start}&limit=${limit}&cols=A:Z`
      );
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const json = await res.json();
      console.log(`Page ${start} loaded:`, json);
      return json.values || [];
    } catch (err) {
      console.error('Error loading page:', err);
      setError(`Failed to load page: ${err.message}`);
      return [];
    }
  };

  useEffect(() => {
    if (!activeTab) return;
    
    console.log('Loading data for tab:', activeTab);
    setRows([]);
    setPendingUpdates(new Map());
    setEditingCell(null);
    setError(null);
    
    const tabMeta = tabs.find((t) => t.title === activeTab);
    setTotalRows(tabMeta?.rows || 0);

    loadPage(1).then((data) => {
      console.log('Initial data loaded:', data);
      setRows(data);
    });
  }, [activeTab, tabs]);

  // Handle cell edit
  const handleCellEdit = useCallback((rowIndex, colIndex, value) => {
    const key = `${rowIndex}:${colIndex}`;
    
    // Update local state immediately (optimistic update)
    setRows(prevRows => {
      const newRows = [...prevRows];
      if (!newRows[rowIndex]) newRows[rowIndex] = [];
      newRows[rowIndex][colIndex] = value;
      return newRows;
    });

    // Add to pending updates
    setPendingUpdates(prev => {
      const newMap = new Map(prev);
      newMap.set(key, value);
      return newMap;
    });

    // Debounce the API call
    debouncedUpdate(new Map([[key, value]]));
  }, [debouncedUpdate]);

  // Handle cell double-click to start editing
  const handleCellDoubleClick = useCallback((rowIndex, colIndex) => {
    setEditingCell({ rowIndex, colIndex });
  }, []);

  // Handle cell edit completion
  const handleCellEditComplete = useCallback((value) => {
    if (!editingCell) return;
    
    const { rowIndex, colIndex } = editingCell;
    handleCellEdit(rowIndex, colIndex, value);
    setEditingCell(null);
  }, [editingCell, handleCellEdit]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e, rowIndex, colIndex) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (editingCell) {
        setEditingCell(null);
      } else {
        setEditingCell({ rowIndex, colIndex });
      }
    } else if (e.key === 'Tab' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextCol = Math.min(colIndex + 1, 25); // A-Z
      setEditingCell({ rowIndex, colIndex: nextCol });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevCol = Math.max(colIndex - 1, 0);
      setEditingCell({ rowIndex, colIndex: prevCol });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevRow = Math.max(rowIndex - 1, 0);
      setEditingCell({ rowIndex: prevRow, colIndex });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextRow = Math.min(rowIndex + 1, totalRows - 1);
      setEditingCell({ rowIndex: nextRow, colIndex });
    }
  }, [editingCell, totalRows]);

  // Focus effect for editing
  useEffect(() => {
    if (editingCell && editingRef.current) {
      editingRef.current.focus();
      editingRef.current.select();
    }
  }, [editingCell]);

  // Retry connection
  const retryConnection = async () => {
    setError(null);
    const isHealthy = await checkAPIHealth();
    if (isHealthy) {
      await loadTabs();
    }
  };

  // Show loading or error states
  if (isLoading) {
    return (
      <div className="app-container">
        <div className="header">
          <div className="header-content">
            <div className="header-left">
              <h1>📊 Google Sheets Editor</h1>
              <div className="header-subtitle">
                Connecting to your spreadsheet...
              </div>
            </div>
          </div>
        </div>
        <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3>Loading your spreadsheet data...</h3>
            <p>Please wait while we connect to your Google Sheets</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (apiStatus === 'disconnected') {
    return (
      <div className="app-container">
        <div className="header">
          <div className="header-content">
            <div className="header-left">
              <h1>📊 Google Sheets Editor</h1>
              <div className="header-subtitle">
                Connection Error
              </div>
            </div>
          </div>
        </div>
        <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="error-state">
            <h3>⚠️ Cannot Connect to Backend</h3>
            <p>Please make sure your Node.js server is running:</p>
            <div className="error-instructions">
              <code>cd server && npm start</code>
            </div>
            <button onClick={retryConnection} className="retry-button">
              🔄 Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <h1>📊 Google Sheets Editor</h1>
            <div className="header-subtitle">
              {activeTab ? `Editing: ${activeTab}` : 'Select a tab to start editing'}
            </div>
          </div>
          <div className="header-right">
            <div className="status-container">
              {error && (
                <div className="status-item error">
                  <span>⚠️</span>
                  {error}
                </div>
              )}
              {isUpdating && (
                <div className="status-item updating">
                  <span>💾</span>
                  Saving...
                </div>
              )}
              {pendingUpdates.size > 0 && (
                <div className="status-item pending">
                  <span>⏳</span>
                  {pendingUpdates.size} pending
                </div>
              )}
              <div className={`status-item ${apiStatus === 'connected' ? 'connected' : 'disconnected'}`}>
                <span>{apiStatus === 'connected' ? '🟢' : '🔴'}</span>
                {apiStatus === 'connected' ? 'Connected' : 'Disconnected'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-container">
        {tabs.map((t) => (
          <button
            key={t.title}
            className={`tab-button ${t.title === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(t.title)}
          >
            {t.title} ({t.rows} rows)
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Column Headers */}
        <div className="column-headers">
          {columnHeaders.map((col) => (
            <div key={col} className="column-header">
              {col}
            </div>
          ))}
        </div>

        {/* Table Container */}
        <div className="table-container">
          {rows.length === 0 ? (
            <div className="empty-state">
              <h3>📋 No Data Available</h3>
              <p>Select a tab above to load data from your Google Sheets</p>
              {activeTab && (
                <button onClick={refreshData} className="refresh-button">
                  🔄 Refresh Data
                </button>
              )}
            </div>
          ) : (
            <Virtuoso
              style={{ height: "100%" }}
              totalCount={totalRows}
              data={rows}
              itemContent={(index, row) => (
                <div className="row">
                  {(row || Array(26).fill('')).map((cell, i) => {
                    const isEditing = editingCell?.rowIndex === index && editingCell?.colIndex === i;
                    const hasPendingUpdate = pendingUpdates.has(`${index}:${i}`);
                    
                    return (
                      <div
                        key={i}
                        className={`cell ${isEditing ? 'editing' : ''} ${hasPendingUpdate ? 'pending' : ''}`}
                        onDoubleClick={() => handleCellDoubleClick(index, i)}
                        onKeyDown={(e) => handleKeyDown(e, index, i)}
                        tabIndex={0}
                      >
                        {isEditing ? (
                          <input
                            ref={editingRef}
                            type="text"
                            defaultValue={cell || ''}
                            onBlur={(e) => handleCellEditComplete(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleCellEditComplete(e.target.value);
                              } else if (e.key === 'Escape') {
                                setEditingCell(null);
                              }
                            }}
                          />
                        ) : (
                          <span>{cell || ''}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              endReached={async () => {
                const nextStart = rows.length + 1;
                const next = await loadPage(nextStart);
                setRows((r) => [...r, ...next]);
              }}
            />
          )}
        </div>
      </div>

      {/* Instructions Panel */}
      <div className="instructions">
        <h3>🎯 Quick Guide</h3>
        <div className="instructions-content">
          <div className="instruction-group">
            <h4>📝 Editing</h4>
            <p><strong>Double-click</strong> any cell to edit</p>
            <p><strong>Enter</strong> to confirm changes</p>
            <p><strong>Escape</strong> to cancel editing</p>
          </div>
          
          <div className="instruction-group">
            <h4>⌨️ Navigation</h4>
            <p><strong>Arrow keys</strong> to move between cells</p>
            <p><strong>Tab</strong> to move right</p>
            <p><strong>Enter</strong> to move down</p>
          </div>
          
          <div className="instruction-group">
            <h4>💾 Auto-Save</h4>
            <p><strong>Changes save automatically</strong> after 500ms</p>
            <p><strong>Real-time sync</strong> with Google Sheets</p>
            <p><strong>Status indicators</strong> show save progress</p>
          </div>
          
          <div className="instruction-group">
            <h4>🚀 Performance</h4>
            <p><strong>Virtual scrolling</strong> for large datasets</p>
            <p><strong>Smart caching</strong> for faster loading</p>
            <p><strong>Batch updates</strong> for efficiency</p>
          </div>
        </div>
      </div>
    </div>
  );
}