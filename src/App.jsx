import { useState } from 'react';
import './index.css';
import UrlToPdf from './components/UrlToPdf';
import HtmlToPdf from './components/HtmlToPdf';
import OfficeToPdf from './components/OfficeToPdf';

function App() {
  const [activeTab, setActiveTab] = useState('url2pdf');

  return (
    <div className="app-container">
      <aside className="sidebar glass-panel" style={{ borderRadius: 0, borderTop: 0, borderBottom: 0, borderLeft: 0 }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Gotenberg
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Document Conversion API
          </p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            className={`nav-btn ${activeTab === 'url2pdf' ? 'active' : ''}`}
            onClick={() => setActiveTab('url2pdf')}
          >
            URL to PDF
          </button>
          <button 
            className={`nav-btn ${activeTab === 'html2pdf' ? 'active' : ''}`}
            onClick={() => setActiveTab('html2pdf')}
          >
            HTML to PDF
          </button>
          <button 
            className={`nav-btn ${activeTab === 'office2pdf' ? 'active' : ''}`}
            onClick={() => setActiveTab('office2pdf')}
          >
            Office to PDF
          </button>
        </nav>
      </aside>
      
      <main className="main-content">
        <div className="content-wrapper">
          <header style={{ marginBottom: '3rem' }}>
            <h1 className="animate-fade-in" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              {activeTab === 'url2pdf' && 'Convert URL to PDF'}
              {activeTab === 'html2pdf' && 'Convert HTML to PDF'}
              {activeTab === 'office2pdf' && 'Convert Office File to PDF'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }} className="animate-fade-in delay-100">
              Generate pixel-perfect PDFs using the Gotenberg API engine.
            </p>
          </header>

          <div className="glass-panel animate-fade-in delay-200" style={{ padding: '2.5rem' }}>
            {activeTab === 'url2pdf' && <UrlToPdf />}
            {activeTab === 'html2pdf' && <HtmlToPdf />}
            {activeTab === 'office2pdf' && <OfficeToPdf />}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App;
