import { useState } from 'react';
import './index.css';
import UrlToPdf from './components/UrlToPdf';
import HtmlToPdf from './components/HtmlToPdf';
import MarkdownToPdf from './components/MarkdownToPdf';
import OfficeToPdf from './components/OfficeToPdf';
import MergePdfs from './components/MergePdfs';

function App() {
  const [activeTab, setActiveTab] = useState('url2pdf');

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-text">GTNBG</div>
          <div className="logo-sub">Engine Interface</div>
        </div>

        <nav>
          <div className="nav-category">Web Input</div>
          <button 
            className={`nav-item ${activeTab === 'url2pdf' ? 'active' : ''}`}
            onClick={() => setActiveTab('url2pdf')}
          >
            URL to PDF
          </button>
          <button 
            className={`nav-item ${activeTab === 'html2pdf' ? 'active' : ''}`}
            onClick={() => setActiveTab('html2pdf')}
          >
            HTML to PDF
          </button>
          <button 
            className={`nav-item ${activeTab === 'markdown2pdf' ? 'active' : ''}`}
            onClick={() => setActiveTab('markdown2pdf')}
          >
            Markdown to PDF
          </button>
          
          <div className="nav-category">Office Input</div>
          <button 
            className={`nav-item ${activeTab === 'office2pdf' ? 'active' : ''}`}
            onClick={() => setActiveTab('office2pdf')}
          >
            Document to PDF
          </button>

          <div className="nav-category">Utilities</div>
          <button 
            className={`nav-item ${activeTab === 'mergePdfs' ? 'active' : ''}`}
            onClick={() => setActiveTab('mergePdfs')}
          >
            Merge PDFs
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <div className="content-wrapper">
          <header className="animate-in">
            <h1 className="section-title">
              {activeTab === 'url2pdf' && 'URL -> PDF'}
              {activeTab === 'html2pdf' && 'HTML -> PDF'}
              {activeTab === 'markdown2pdf' && 'MARKDOWN -> PDF'}
              {activeTab === 'office2pdf' && 'DOC -> PDF'}
              {activeTab === 'mergePdfs' && 'FUSE MULTIPLE PDFS'}
            </h1>
            <p className="section-desc">
              Generate and manipulate pixel-perfect PDFs using the Gotenberg API engine.
            </p>
          </header>

          <div className="panel animate-in" style={{ animationDelay: '0.1s' }}>
            {activeTab === 'url2pdf' && <UrlToPdf />}
            {activeTab === 'html2pdf' && <HtmlToPdf />}
            {activeTab === 'markdown2pdf' && <MarkdownToPdf />}
            {activeTab === 'office2pdf' && <OfficeToPdf />}
            {activeTab === 'mergePdfs' && <MergePdfs />}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App;
