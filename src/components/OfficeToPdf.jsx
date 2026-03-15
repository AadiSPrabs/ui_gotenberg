import { useState, useRef } from 'react';
import { appendHistory } from '../utils/HistoryUtils';

export default function OfficeToPdf() {
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
      files.forEach(file => formData.append('files', file));

      // Instruct Gotenberg to merge them if more than 1 file is passed
      if (files.length > 1) {
        formData.append('merge', 'true');
      }

      const response = await fetch('/api/forms/libreoffice/convert', {
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
      
      const originalName = files[0].name.substring(0, files[0].name.lastIndexOf('.')) || files[0].name;
      a.download = files.length > 1 ? `merged_${files.length}_office_docs.pdf` : `${originalName}_gtbg.pdf`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();

      // Log to history
      appendHistory({
        id: Date.now(),
        filename: files.length > 1 ? `${files.length} OFFICE DOCUMENTS` : files[0].name,
        type: 'OFFICE_TO_PDF',
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>

        <div>
          <h3 style={{ marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {files.length > 0 ? `${files.length} DOCUMENT(S) MOUNTED` : 'MOUNT OFFICE DOCUMENT(S)'}
          </h3>
          {files.length > 0 ? (
            <div className="file-size-mono" style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', maxHeight: '100px', overflowY: 'auto' }}>
              {files.map((file, idx) => (
                <div key={idx} style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  [{idx + 1}] {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              ))}
            </div>
          ) : (
            <p className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              [ DOCX / XLSX / PPTX / TXT ] // SELECT MULTIPLE TO AUTO-MERGE
            </p>
          )}
        </div>
        
        <input 
          type="file" 
          multiple
          accept=".docx,.doc,.xlsx,.xls,.pptx,.ppt,.rtf,.txt,.odt,.ods,.odp" 
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
          'COMPILE PDF'
        )}
      </button>
    </form>
  );
}
