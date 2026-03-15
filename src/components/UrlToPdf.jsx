import { useState } from 'react';

export default function UrlToPdf() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('url', url);

      const response = await fetch('/api/forms/chromium/convert/url', {
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
      const filenameStr = new URL(url).hostname.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      a.download = `${filenameStr || 'website'}_converted.pdf`;
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
    <form onSubmit={handleConvert} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="input-group">
        <label className="input-label">Website URL</label>
        <input 
          type="url" 
          className="input-field" 
          placeholder="https://example.com" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      {error && (
        <div style={{ color: '#ff7b72', background: 'rgba(255, 123, 114, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 123, 114, 0.2)' }}>
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn-primary" 
        disabled={loading || !url}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
            Converting...
          </>
        ) : (
          'Convert to PDF'
        )}
      </button>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </form>
  );
}
