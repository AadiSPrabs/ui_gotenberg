import { useState, useRef } from 'react';

export default function MergePdfs() {
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
    if (files.length < 2) {
      setError('Please select at least 2 PDFs to merge.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      // Gotenberg processes merge files in alphabetically sorted order based on the filename
      // It uses the pdftk engines for this by default.
      files.forEach((file) => {
        formData.append('files', file);
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
          {files.length > 0 ? (
            <div className="file-size-mono" style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', maxHeight: '100px', overflowY: 'auto' }}>
              {files.map((file, idx) => (
                <div key={idx} style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  [{idx + 1}] {file.name} ({(file.size / 1024).toFixed(0)} KB)
                </div>
              ))}
            </div>
          ) : (
            <p className="mono" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              [ SELECT 2 OR MORE PDFS ] // FILES MERGED IN ALPHABETICAL ORDER
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
