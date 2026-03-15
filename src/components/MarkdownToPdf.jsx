import { useState, useRef } from 'react';

export default function MarkdownToPdf() {
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
      formData.append('files', file, 'index.md');

      const response = await fetch('/api/forms/chromium/convert/markdown', {
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
      a.download = `${file.name.replace('.md', '').replace('.markdown', '')}_gtbg.pdf`;
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>

        <div>
          <h3 style={{ marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {file ? file.name : 'MOUNT MARKDOWN FILE'}
          </h3>
          {file ? (
            <div className="file-size-mono">SIZE: {(file.size / 1024).toFixed(2)} KB</div>
          ) : (
            <p className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              [ CLICK TO BROWSE OR DRAG ] // ACCEPTS .MD
            </p>
          )}
        </div>
        
        <input 
          type="file" 
          accept=".md,.markdown" 
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
