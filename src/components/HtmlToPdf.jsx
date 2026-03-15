import { useState, useRef } from 'react';

export default function HtmlToPdf() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('files', file, 'index.html'); // Gotenberg Chromium expects index.html for single file HTML

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
      a.download = `${file.name.replace('.html', '').replace('.htm', '')}_gtbg.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during conversion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleConvert}>
      
      <div 
        className={`file-dropzone ${file ? 'active' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="file-dropzone-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
          <polyline points="13 2 13 9 20 9"></polyline>
        </svg>
        
        <div>
          <h3 style={{ marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {file ? file.name : 'MOUNT HTML ASSET'}
          </h3>
          {file ? (
            <div className="file-size-mono">SIZE: {(file.size / 1024).toFixed(2)} KB</div>
          ) : (
            <p className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              [ CLICK TO BROWSE OR DRAG ] // ACCEPTS .HTML
            </p>
          )}
        </div>
        
        <input 
          type="file" 
          accept=".html,.htm" 
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
        disabled={loading || !file}
      >
        {loading ? (
          <span className="loader-mono">PROCESSING...</span>
        ) : (
          'COMPILE PDF'
        )}
      </button>
    </form>
  );
}
