import { useState, useRef } from 'react';
import { appendHistory } from '../utils/HistoryUtils';

export default function HtmlToPdf() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      
      // Gotenberg HTML conversion actually expects an index.html file
      // If uploading multiple files (like an index.html + style.css + image.png), 
      // one of them MUST be index.html. If it's a single file, it's renamed to index.html in the UI request for robustness, though we just append it normally here.
      files.forEach((file) => {
        // Gotenberg strictly requires "index.html" as the entry point
        if (files.length === 1 && file.name !== 'index.html') {
          formData.append('files', file, 'index.html');
        } else {
          formData.append('files', file);
        }
      });

      const response = await fetch('/api/forms/chromium/convert/html', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Conversion failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      // Try to name it after the index.html or the first file
      const indexFile = files.find(f => f.name === 'index.html') || files[0];
      const originalName = indexFile.name.substring(0, indexFile.name.lastIndexOf('.')) || indexFile.name;
      a.download = `${originalName}_gtbg.pdf`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();

      // Log to history
      appendHistory({
        id: Date.now(),
        filename: files.length > 1 ? `${files.length} HTML ASSETS` : files[0].name,
        type: 'HTML_TO_PDF',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message || 'An error occurred. Check Gotenberg connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleConvert}>
      
      <div 
        className={`file-dropzone ${files.length > 0 ? 'active' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="file-dropzone-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
          <polyline points="13 2 13 9 20 9"></polyline>
        </svg>

        <div>
           <h3 style={{ marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {files.length > 0 ? `${files.length} ASSET(S) MOUNTED` : 'MOUNT HTML ASSETS'}
          </h3>
          {files.length > 0 ? (
            <div className="file-size-mono" style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', maxHeight: '100px', overflowY: 'auto' }}>
              {files.map((file, idx) => (
                <div key={idx} style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  [{idx + 1}] {file.name} ({(file.size / 1024 / 1024).toFixed(4)} MB)
                  {file.name === 'index.html' && <span style={{ color: 'var(--accent-color)' }}> [PRIMARY]</span>}
                </div>
              ))}
            </div>
          ) : (
             <p className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              [ CLICK TO BROWSE OR DRAG ] // ACCEPTS .HTML, .CSS, .PNG
            </p>
          )}
        </div>
        
        <input 
          type="file" 
          multiple
          accept=".html,.htm,.css,.js,.jpg,.jpeg,.png,.svg,.woff,.woff2,.ttf" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
        />
      </div>

      {error && (
        <div className="alert-box alert-error">
          <strong style={{ display: 'block', marginBottom: '0.2rem' }}>ERR_FAIL:</strong> {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn-primary" 
        disabled={loading || files.length === 0}
      >
        {loading ? (
          <span className="loader-mono">PROCESSING...</span>
        ) : (
          'PROCESS HTML'
        )}
      </button>
    </form>
  );
}
