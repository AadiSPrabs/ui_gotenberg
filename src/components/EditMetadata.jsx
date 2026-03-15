import { useState, useRef } from 'react';
import { appendHistory } from '../utils/HistoryUtils';

export default function EditMetadata() {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState('{\n  "Author": "GTNBG Engine",\n  "Title": "Processed Document"\n}');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    setError('');
    
    try {
      const metadataObj = JSON.parse(metadata);
      const formData = new FormData();
      formData.append('files', file);
      formData.append('metadata', JSON.stringify(metadataObj));

      const response = await fetch('/api/forms/pdfengines/metadata', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Metadata update failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      a.download = `${originalName}_meta_gtbg.pdf`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();

      appendHistory({
        id: Date.now(),
        filename: file.name,
        type: 'METADATA_EDIT',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message || 'An error occurred during metadata update. Ensure JSON is valid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <div 
        className={`file-dropzone ${file ? 'active' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="file-dropzone-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <path d="M12 18V12"></path>
          <path d="M9 15l3 3 3-3"></path>
        </svg>

        <div>
          <h3 style={{ marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {file ? file.name : 'MOUNT PDF FOR METADATA'}
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

      <div style={{ marginTop: '1.5rem' }}>
        <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
          METADATA_JSON_STRING
        </label>
        <textarea 
          className="input-field mono" 
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          rows="5"
          style={{ 
            width: '100%', 
            padding: '1rem', 
            backgroundColor: 'rgba(0,0,0,0.3)', 
            border: '1px solid var(--border-color)', 
            color: 'var(--accent-color)',
            resize: 'vertical',
            fontSize: '0.85rem'
          }}
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
          <span className="loader-mono">INJECTING...</span>
        ) : (
          'UPDATE METADATA'
        )}
      </button>
    </form>
  );
}
