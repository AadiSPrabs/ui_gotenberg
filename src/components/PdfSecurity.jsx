import { useState, useRef } from 'react';
import { appendHistory } from '../utils/HistoryUtils';

export default function PdfSecurity() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const [userPassword, setUserPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [permissions, setPermissions] = useState({
    allowPrinting: true,
    allowModifyContents: true,
    allowCopy: true,
    allowModifyAnnotations: true,
    allowFillForms: true,
    allowScreenReaders: true,
    allowAssembly: true,
    allowDegradedPrinting: true,
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleToggle = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProtect = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    setError('');
    
    try {
      if (!userPassword) {
        throw new Error('User Password is required for encryption.');
      }

      const formData = new FormData();
      formData.append('files', file);
      formData.append('userPassword', userPassword);
      
      if (ownerPassword) {
        formData.append('ownerPassword', ownerPassword);
      }
      
      // Gotenberg 8 /encrypt endpoint focuses on passwords.
      // Setting an ownerPassword effectively locks the PDF settings, 
      // but specific granular flags are not exposed in the standard v8 API.

      const response = await fetch('/api/forms/pdfengines/encrypt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Protection failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      a.download = `${originalName}_protected.pdf`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();

      appendHistory({
        id: Date.now(),
        filename: file.name,
        type: 'PDF_SECURITY',
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Security error:', err);
      setError(`Protection failed: ${err.message || 'Check connection to Gotenberg API.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleProtect}>
      <div 
        className={`file-dropzone ${file ? 'active' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="file-dropzone-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>

        <div>
          <h3 style={{ marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {file ? file.name : 'MOUNT PDF FOR PROTECTION'}
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

      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
            USER_PASSWORD (REQUIRED TO OPEN)
          </label>
          <input 
            type="password" 
            className="input-field mono" 
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            placeholder="ENCRYPT_FILE"
            required
            style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }}
          />
        </div>
        <div>
          <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
            OWNER_PASSWORD (OPTIONAL)
          </label>
          <input 
            type="password" 
            className="input-field mono" 
            value={ownerPassword}
            onChange={(e) => setOwnerPassword(e.target.value)}
            placeholder="PROTECT_SETTINGS"
            style={{ width: '100%', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }}
          />
        </div>
      </div>

      <div className="alert-box mono" style={{ marginTop: '1.5rem', fontSize: '0.75rem', opacity: 0.8 }}>
        <strong style={{ color: 'var(--accent-color)' }}>NOTE:</strong> Gotenberg 8 focuses on password-based encryption via QPDF. Setting an **Owner Password** effectively restricts permission changes and document editing.
      </div>

      {error && (
        <div className="alert-box alert-error" style={{ marginTop: '1.5rem' }}>
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
          <span className="loader-mono">LOCKING...</span>
        ) : (
          'APPLY SECURITY'
        )}
      </button>
    </form>
  );
}
