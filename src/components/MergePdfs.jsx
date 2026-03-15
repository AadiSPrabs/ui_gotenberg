import { useState, useRef } from 'react';
import { appendHistory } from '../utils/HistoryUtils';

export default function MergePdfs() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files)]);
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
    if (files.length < 2) {
      setError('Please select at least 2 PDFs to merge.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      
      // Prefix files numerically (e.g., 0001_name.pdf) to enforce user ordering
      // Since Gotenberg merges files in alphabetical order by filename.
      files.forEach((file, index) => {
        const prefix = (index + 1).toString().padStart(4, '0');
        const prefixedName = `${prefix}_${file.name}`;
        formData.append('files', file, prefixedName);
      });

      const response = await fetch('/api/forms/pdfengines/merge', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Merge failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `merged_${files.length}_files_gtbg.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();

      appendHistory({
        id: Date.now(),
        filename: `${files.length} PDFs MERGED`,
        type: 'PDF_MERGE',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during merging.');
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
          <path d="M12 18v-6"></path>
          <path d="M9 15h6"></path>
        </svg>

        <div>
          <h3 style={{ marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {files.length > 0 ? `${files.length} ASSETS MOUNTED` : 'MOUNT MULTIPLE PDFS'}
          </h3>
          {files.length === 0 && (
            <p className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              [ SELECT 2 OR MORE PDFS ] // CUSTOM ORDER SUPPORTED
            </p>
          )}
        </div>
        
        <input 
          type="file" 
          accept=".pdf" 
          multiple
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

      {error && (
        <div className="alert-box alert-error">
          <strong style={{ display: 'block', marginBottom: '0.2rem' }}>ERR_FAIL:</strong> {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn-primary" 
        disabled={loading || files.length < 2}
      >
        {loading ? (
          <span className="loader-mono">PROCESSING...</span>
        ) : (
          'FUSE PDFS'
        )}
      </button>
    </form>
  );
}
