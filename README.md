# Gotenberg UI v2.1 (Industrial Edition)

A professional, self-hosted web UI frontend for the powerful [Gotenberg](https://gotenberg.dev/) document conversion API.

This project focuses on a **Brutalist / Industrial design** aesthetic, providing a stark, high-performance interface for complex PDF manipulation tasks. It is fully aligned with **Gotenberg 8**.

---

## 🛠️ Features

### **Web & Office Conversion**
- **URL to PDF**: Render remote web pages using Chromium.
- **HTML to PDF**: Convert multi-file HTML assets with full CSS support.
- **Markdown to PDF**: Professional document generation from Markdown.
- **Office to PDF**: Convert Word, Excel, PowerPoint, and Text files (LibreOffice powered).
  - *New:* Supports **Merging** multiple office files into a single PDF during conversion.

### **Advanced PDF Utilities**
- **Merge PDFs**: Consolidated multiple PDF sources with forced reordering.
- **Split PDF**: Extract specific page ranges or individual sheets.
- **Convert to PDF/A**: Enforce archival standards for long-term storage.
- **Edit Metadata**: Side-by-side inspection and modification of document properties.
- **PDF Security**: Encrypt documents with User/Owner passwords via QPDF.
- **Flatten PDF**: Make interactive form fields and annotations static.

### **UI & Experience**
- **Mobile Responsive**: Refined layout for phones and tablets with a mobile sidebar menu.
- **Operation History**: Local log of recent operations stored securely in `localStorage`.
- **Industrial Design**: High-contrast, utilitarian interface using the `Outfit` and `JetBrains Mono` typefaces.
- **No Dependencies**: All logic is bundled into a single Docker-compose stack.

---

## 🚀 Deployment

### **Quick Start (Docker Compose)**
The recommended way to deploy is using the provided `docker-compose.yml`. This handles the frontend, the Gotenberg engine, and the reverse proxy automatically.

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

### **Environment Variables**
You can configure the Gotenberg endpoint in the `docker-compose.yml` if you are running the engine on a different machine:
- `GOTENBERG_URL`: Default is `http://gotenberg:3000`

---

## 🏗️ Technical Architecture
- **Frontend**: Vite + React, Vanilla CSS (Industrial theme)
- **Engine**: [Gotenberg 8](https://github.com/gotenberg/gotenberg) (Chromium, LibreOffice, PDFtk, QPDF)
- **Reverse Proxy**: Caddy v2
- **Connectivity**: Local proxying via `vite.config.js` and `Caddyfile` to avoid CORS issues.

---

## 🛡️ Security Note
Standard encryption is handled via the `/encrypt` endpoint (Power by QPDF). Setting an **Owner Password** restricts document modifications and permission changes.

---

*Built with precision for the open-source community.*
