import { useState, useEffect } from 'react';
import { getHistory, clearHistory, removeHistoryItem } from '../utils/HistoryUtils';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all conversion history?")) {
      const empty = clearHistory();
      setHistory(empty);
    }
  };

  const handleDeleteItem = (id) => {
    const updated = removeHistoryItem(id);
    setHistory(updated);
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Operations</h3>
        {history.length > 0 && (
          <button 
            onClick={handleClearAll}
            style={{
              background: 'transparent',
              color: 'var(--accent-color)',
              border: '1px solid var(--accent-color)',
              padding: '0.3rem 0.8rem',
              cursor: 'pointer',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.8rem',
              textTransform: 'uppercase'
            }}
          >
            Clear Log
          </button>
        )}
      </div>

      <div style={{ padding: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
        <p className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          LOCAL LOGS ONLY. GOTENBERG IS STATELESS AND IMMEDIATELY PURGES UPLOADED FILES AFTER PROCESSING.
        </p>
        
        {history.length === 0 ? (
          <div className="mono" style={{ color: 'var(--text-secondary)', padding: '2rem 0', textAlign: 'center' }}>
            [ NO RECENT ACTIVITY CONFIGURED ]
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {history.map(item => (
              <div key={item.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.8rem', 
                backgroundColor: 'var(--surface-color)',
                borderLeft: '2px solid var(--accent-color)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div style={{ fontWeight: '700' }}>{item.filename}</div>
                  <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    [{item.type}] // {formatDate(item.timestamp)}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  title="Remove Entry"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '0.2rem 0.5rem'
                  }}
                >
                  &#x2715;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
