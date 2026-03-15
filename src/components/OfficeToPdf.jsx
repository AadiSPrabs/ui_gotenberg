import { useState, useRef } from 'react';
import { appendHistory } from '../utils/HistoryUtils';

export default function OfficeToPdf() {
  const [files, setFiles] = useState([]);
  const [merge, setMerge] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const ALLOWED_EXTENSIONS = ['.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt', '.rtf', '.txt', '.odt', '.ods', '.odp'];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const invalidFiles = newFiles.filter(file => {
        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        return !ALLOWED_EXTENSIONS.includes(ext);
      });

      if (invalidFiles.length > 0) {
        setError(`UNSUPPORTED_FILETYPE: ${invalidFiles.map(f => f.name).join(', ')}`);
        return;
      }

      setFiles(prev => [...prev, ...newFiles]);
      setError('');
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    if (files.length <= 1) setError('');
  };

  const clearAll = () => {
    setFiles([]);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    const item = newFiles[index];
    newFiles[index] = newFiles[index - 1];
    newFiles[index - 1] = item;
    setFiles(newFiles);
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    const item = newFiles[index];
    newFiles[index] = newFiles[index + 1];
    newFiles[index + 1] = item;
    setFiles(newFiles);
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      
      // If merging, use numerical prefixing to enforce order
      files.forEach((file, index) => {
        if (files.length > 1 && merge) {
          const prefix = (index + 1).toString().padStart(4, '0');
          formData.append('files', file, `${prefix}_${file.name}`);
        } else {
          formData.append('files', file);
        }
      });

      if (files.length > 1 && merge) {
        formData.append('merge', 'true');
      }

      const response = await fetch('/api/forms/libreoffice/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Conversion failed: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      const isZip = contentType && contentType.includes('application/zip');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      const firstFileName = files[0].name.substring(0, files[0].name.lastIndexOf('.')) || files[0].name;
      
      if (isZip) {
        a.download = `converted_${files.length}_docs.zip`;
      } else {
        a.download = files.length > 1 && merge ? `merged_${files.length}_docs.pdf` : `${firstFileName}.pdf`;
      }
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();

      appendHistory({
        id: Date.now(),
        filename: files.length > 1 ? `${files.length} DOCUMENTS (${merge ? 'MERGED' : 'SEPARATE'})` : files[0].name,
        type: 'OFFICE_TO_PDF',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message || 'An error occurred during conversion.');
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
          {files.length === 0 && (
            <p className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              [ CLICK TO BROWSE OR DRAG ] // MULTIPLE FILES SUPPORTED
            </p>
          )}
        </div>
        
        <input 
          type="file" 
          multiple
          accept={ALLOWED_EXTENSIONS.join(',')} 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          style={{ display: 'none' }} 
        />
      </div>

      {files.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
             <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>FILE_QUEUE — ({files.length} ITEMS)</span>
             <button type="button" onClick={clearAll} className="mono" style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.7rem' }}>[ CLEAR_ALL ]</button>
          </div>
          <div style={{ border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            {files.map((file, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0.8rem', 
                gap: '1rem',
                borderBottom: idx === files.length - 1 ? 'none' : '1px solid var(--border-color)'
              }}>
                <span className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{idx + 1}.</span>
                <span className="mono" style={{ flex: 1, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'white', cursor: 'pointer', padding: '0.2rem 0.5rem' }}>↑</button>
                  <button type="button" onClick={() => moveDown(idx)} disabled={idx === files.length - 1} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'white', cursor: 'pointer', padding: '0.2rem 0.5rem' }}>↓</button>
                  <button type="button" onClick={() => removeFile(idx)} style={{ background: 'none', border: '1px solid var(--border-color)', color: 'var(--accent-color)', cursor: 'pointer', padding: '0.2rem 0.5rem' }}>X</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 1 && (
        <div style={{ padding: '0 0.5rem', marginBottom: '1.5rem' }}>
          <label className="mono" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontSize: '0.85rem' }}>
            <div 
              onClick={() => setMerge(!merge)}
              style={{ 
                width: '40px', 
                height: '20px', 
                backgroundColor: merge ? 'var(--accent-color)' : 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                position: 'relative',
                transition: 'var(--calc-transition)',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                position: 'absolute',
                top: '2px',
                left: merge ? '22px' : '2px',
                width: '14px',
                height: '14px',
                backgroundColor: merge ? 'var(--accent-text)' : 'var(--text-secondary)',
                transition: 'var(--calc-transition)'
              }} />
            </div>
            <span style={{ color: merge ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              MERGE_DOCUMENTS: {merge ? 'ENABLED' : 'DISABLED (ZIP OUTPUT)'}
            </span>
          </label>
        </div>
      )}

      <div style={{ marginBottom: '1.5rem', border: '1px solid var(--border-color)', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.01)' }}>
        <h4 className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>Supported Formats</h4>
        <div className="file-size-mono" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', 
          gap: '0.5rem',
          fontSize: '0.75rem'
        }}>
          {ALLOWED_EXTENSIONS.map(ext => (
            <div key={ext} style={{ color: 'var(--text-primary)' }}>{ext.toUpperCase()}</div>
          ))}
        </div>
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
