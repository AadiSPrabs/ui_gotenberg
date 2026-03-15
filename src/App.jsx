import { useState } from 'react';
import './index.css';
import UrlToPdf from './components/UrlToPdf';
import HtmlToPdf from './components/HtmlToPdf';
import MarkdownToPdf from './components/MarkdownToPdf';
import OfficeToPdf from './components/OfficeToPdf';
import MergePdfs from './components/MergePdfs';
import History from './components/History';
import SplitPdf from './components/SplitPdf';
import ConvertToPdfA from './components/ConvertToPdfA';
import EditMetadata from './components/EditMetadata';
import PdfSecurity from './components/PdfSecurity';
import FlattenPdf from './components/FlattenPdf';

function App() {
  const [activeTab, setActiveTab] = useState('url2pdf');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    closeSidebar();
  };

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Top Bar */}
      <div className="mobile-header">
        <div className="logo-text" style={{ fontSize: '1rem' }}>Gotenberg-UI</div>
        <button className="mobile-menu-btn mono" onClick={toggleSidebar}>
          {isSidebarOpen ? '[ CLOSE ]' : '[ MENU ]'}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="logo-container">
          <div className="logo-text" style={{ textTransform: 'none' }}>Gotenberg-UI</div>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto' }}>
          <div className="nav-category">Web Input</div>
          <button 
            className={`nav-item ${activeTab === 'url2pdf' ? 'active' : ''}`}
            onClick={() => handleNavClick('url2pdf')}
          >
            URL to PDF
          </button>
          <button 
            className={`nav-item ${activeTab === 'html2pdf' ? 'active' : ''}`}
            onClick={() => handleNavClick('html2pdf')}
          >
            HTML to PDF
          </button>
          <button 
            className={`nav-item ${activeTab === 'markdown2pdf' ? 'active' : ''}`}
            onClick={() => handleNavClick('markdown2pdf')}
          >
            Markdown to PDF
          </button>
          
          <div className="nav-category">Office Input</div>
          <button 
            className={`nav-item ${activeTab === 'office2pdf' ? 'active' : ''}`}
            onClick={() => handleNavClick('office2pdf')}
          >
            Document to PDF
          </button>

          <div className="nav-category">Utilities</div>
          <button 
            className={`nav-item ${activeTab === 'mergePdfs' ? 'active' : ''}`}
            onClick={() => handleNavClick('mergePdfs')}
          >
            Merge PDFs
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'splitPdf' ? 'active' : ''}`}
            onClick={() => handleNavClick('splitPdf')}
          >
            Split PDF
          </button>
          <button 
            className={`nav-item ${activeTab === 'pdfA' ? 'active' : ''}`}
            onClick={() => handleNavClick('pdfA')}
          >
            Convert to PDF/A
          </button>
          <button 
            className={`nav-item ${activeTab === 'metadata' ? 'active' : ''}`}
            onClick={() => handleNavClick('metadata')}
          >
            Edit Metadata
          </button>
          <button 
            className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => handleNavClick('security')}
          >
            PDF Security
          </button>
          <button 
            className={`nav-item ${activeTab === 'flatten' ? 'active' : ''}`}
            onClick={() => handleNavClick('flatten')}
          >
            Flatten PDF
          </button>
          <button 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => handleNavClick('history')}
          >
            History Log
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <div className="content-wrapper">
          <header className="animate-in">
            <h1 className="section-title">
              {activeTab === 'url2pdf' && 'URL to PDF'}
              {activeTab === 'html2pdf' && 'HTML to PDF'}
              {activeTab === 'markdown2pdf' && 'Markdown to PDF'}
              {activeTab === 'office2pdf' && 'Document to PDF'}
              {activeTab === 'mergePdfs' && 'Merge PDFs'}
              {activeTab === 'splitPdf' && 'Split PDF'}
              {activeTab === 'pdfA' && 'Convert to PDF/A'}
              {activeTab === 'metadata' && 'Edit Metadata'}
              {activeTab === 'security' && 'PDF Security'}
              {activeTab === 'flatten' && 'Flatten PDF'}
              {activeTab === 'history' && 'History Log'}
            </h1>
            <p className="section-desc">
              {activeTab === 'url2pdf' && 'High-performance Chromium engine for rendering remote web pages into documents.'}
              {activeTab === 'html2pdf' && 'Process local HTML assets and associated styles into pixel-perfect PDF output.'}
              {activeTab === 'markdown2pdf' && 'Translate structured Markdown documents into clean, professional PDF layouts.'}
              {activeTab === 'office2pdf' && 'LibreOffice backed conversion for Word, Excel, and PowerPoint documents.'}
              {activeTab === 'mergePdfs' && 'Fuse multiple PDF sources into a single consolidated document.'}
              {activeTab === 'splitPdf' && 'Extract specific page ranges or individual sheets from a source PDF.'}
              {activeTab === 'pdfA' && 'Enforce archival standards compliance for long-term document storage.'}
              {activeTab === 'metadata' && 'Inject and modify document metadata properties via JSON interface.'}
              {activeTab === 'security' && 'Encrypt documents with user/owner passwords and restrict user permissions.'}
              {activeTab === 'flatten' && 'Convert interactive form fields and annotations into static document content.'}
              {activeTab === 'history' && 'Local operation log of recent processing activity.'}
            </p>
          </header>

          <div className="panel animate-in" style={{ animationDelay: '0.1s' }}>
            {activeTab === 'url2pdf' && <UrlToPdf />}
            {activeTab === 'html2pdf' && <HtmlToPdf />}
            {activeTab === 'markdown2pdf' && <MarkdownToPdf />}
            {activeTab === 'office2pdf' && <OfficeToPdf />}
            {activeTab === 'mergePdfs' && <MergePdfs />}
            {activeTab === 'splitPdf' && <SplitPdf />}
            {activeTab === 'pdfA' && <ConvertToPdfA />}
            {activeTab === 'metadata' && <EditMetadata />}
            {activeTab === 'security' && <PdfSecurity />}
            {activeTab === 'flatten' && <FlattenPdf />}
            {activeTab === 'history' && <History />}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App;
