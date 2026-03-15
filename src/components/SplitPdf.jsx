import { useState, useRef } from 'react';
import { appendHistory } from '../utils/HistoryUtils';

export default function SplitPdf() {
  const [file, setFile] = useState(null);
  const [span, setSpan] = useState('1-1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSplit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('splitMode', 'pages');
      formData.append('splitSpan', span);

      const response = await fetch('/api/forms/pdfengines/split', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Split failed: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      const isZip = contentType && contentType.includes('application/zip');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      
      if (isZip) {
        a.download = `${originalName}_split_results.zip`;
      } else {
        a.download = `${originalName}_split_${span.replace(/,/g, '_')}.pdf`;
      }
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();

      appendHistory({
        id: Date.now(),
        filename: `${file.name} (Pages ${span})`,
        type: 'PDF_SPLIT',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message || 'An error occurred during splitting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSplit}>
      <div 
        className={`file-dropzone ${file ? 'active' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="file-dropzone-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>

        <div>
          <h3 style={{ marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {file ? file.name : 'MOUNT PDF FOR SPLIT'}
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
          SPLIT_SPAN (e.g., "1-3", "1,3,5", "1-5,7-10")
        </label>
        <input 
          type="text" 
          className="input-field mono" 
          value={span}
          onChange={(e) => setSpan(e.target.value)}
          placeholder="ENTER RANGE"
          style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }}
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
          <span className="loader-mono">EXTRACTING...</span>
        ) : (
          'EXTRACT PAGES'
        )}
      </button>
    </form>
  );
}
