import { useState } from 'react';

export default function UrlToPdf() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [options, setOptions] = useState({
    landscape: false,
    printBackground: true
  });

  const handleConvert = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('url', url);
      
      if (options.landscape) {
        formData.append('landscape', 'true');
      }
      if (!options.printBackground) {
        formData.append('printBackground', 'false');
      }

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
      a.download = `${filenameStr || 'website'}_gtbg.pdf`;
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
      <div className="input-group">
        <label className="input-label">Target URL</label>
        <input 
          type="url" 
          className="input-field" 
          placeholder="https://example.com" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={options.landscape} 
            onChange={(e) => setOptions({...options, landscape: e.target.checked})}
            style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--accent-color)' }}
          />
          <span className="mono" style={{ fontSize: '0.9rem', textTransform: 'uppercase' }}>Landscape</span>
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={options.printBackground} 
            onChange={(e) => setOptions({...options, printBackground: e.target.checked})}
            style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--accent-color)' }}
          />
          <span className="mono" style={{ fontSize: '0.9rem', textTransform: 'uppercase' }}>Background Graphics</span>
        </label>
      </div>

      {error && (
        <div className="alert-box alert-error">
          <strong style={{ display: 'block', marginBottom: '0.2rem' }}>ERR_FAIL:</strong> {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn-primary" 
        disabled={loading || !url}
      >
        {loading ? (
          <span className="loader-mono">PROCESSING...</span>
        ) : (
          'GENERATE PDF'
        )}
      </button>
    </form>
  );
}
