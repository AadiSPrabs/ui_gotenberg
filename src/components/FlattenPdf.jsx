import { useState, useRef } from 'react';
import { appendHistory } from '../utils/HistoryUtils';

export default function FlattenPdf() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFlatten = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch('/api/forms/pdfengines/flatten', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Flatten failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      a.download = `${originalName}_flattened_gtbg.pdf`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();

      appendHistory({
        id: Date.now(),
        filename: file.name,
        type: 'PDF_FLATTEN',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message || 'An error occurred during flattening.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleFlatten}>
      <div 
        className={`file-dropzone ${file ? 'active' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="file-dropzone-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <rect x="8" y="12" width="8" height="4"></rect>
        </svg>

        <div>
          <h3 style={{ marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {file ? file.name : 'MOUNT PDF FOR FLATTEN'}
          </h3>
          {file ? (
            <div className="file-size-mono">SIZE: {(file.size / 1024).toFixed(0)} KB</div>
          ) : (
            <p className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              [ SELECT SOURCE PDF ]
            </p>
          )}
        </div>
        
        <input 
          type="file" 
          accept=".pdf" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
        />
      </div>

      {error && (
        <div className="alert-box alert-error" style={{ marginTop: '1rem' }}>
          <strong style={{ display: 'block', marginBottom: '0.2rem' }}>ERR_FAIL:</strong> {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn-primary" 
        disabled={loading || !file}
        style={{ marginTop: '1.5rem' }}
      >
        {loading ? (
          <span className="loader-mono">FLATTENING...</span>
        ) : (
          'FLATTEN PDF'
        )}
      </button>
    </form>
  );
}
