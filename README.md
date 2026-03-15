# Gotenberg UI

A clean, self-hosted web UI frontend for the powerful [Gotenberg](https://gotenberg.dev/) document conversion API.

---

## 🛠️ Features

### **Web & Office Conversion**
- **URL to PDF**: Render remote web pages using Chromium.
- **HTML to PDF**: Convert multi-file HTML assets with full CSS support.
- **Markdown to PDF**: Professional document generation from Markdown.
- **Office to PDF**: Convert Word, Excel, PowerPoint, and Text files (LibreOffice powered).
  - Supports **Merging** multiple office files into a single PDF during conversion.

### **Advanced PDF Utilities**
- **Merge PDFs**: Consolidated multiple PDF sources with forced reordering.
- **Split PDF**: Extract specific page ranges or individual sheets.
- **Convert to PDF/A**: Enforce archival standards for long-term storage.
- **Edit Metadata**: Side-by-side inspection and modification of document properties.
- **PDF Security**: Encrypt documents with User/Owner passwords.
- **Flatten PDF**: Make interactive form fields and annotations static.

### **UI & Experience**
- **Mobile Responsive**: Fully usable on phones and tablets.
- **Operation History**: Local log of recent operations.
- **Modern Design**: Clean, high-performance interface.

---

## 🚀 Deployment

### **Quick Start (Docker Compose)**
1. **Clone the repository:**
   ```bash
   git clone https://github.com/AadiSPrabs/ui_gotenberg.git
   cd ui_gotenberg
   ```

2. **Launch the stack:**
   ```bash
   docker compose up --build -d
   ```

3. **Access the UI:**
   Navigate to `http://localhost:8080` (or your server's IP).

---

## 🏗️ Technical Architecture
- **Frontend**: Vite + React, Vanilla CSS
- **Engine**: [Gotenberg 8](https://github.com/gotenberg/gotenberg)
- **Reverse Proxy**: Caddy v2

---

⭐ **Star this project if you found it useful or like it!**
