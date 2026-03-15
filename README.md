# Gotenberg UI

A beautiful, self-hosted web UI frontend for the powerful [Gotenberg](https://gotenberg.dev/) document conversion API.

This project uses an **"All-in-One" Docker Image** approach. It bundles the official Gotenberg Debian image, a lightweight Caddy web server, and a premium dark-glassmorphism React SPA all into a single container.

## Features
- **URL to PDF**: Convert any live website into a PDF.
- **HTML to PDF**: Upload `.html` files for conversion.
- **Office to PDF**: Upload Word, Excel, PowerPoint, and Text files.
- Completely self-contained: no complex proxy setups or CORS issues needed.

---

## 🚀 How to Deploy on your Server

To get this running on your target server machine (Linux/Windows/macOS) with Docker installed, follow these exact steps:

### 1. Download the Codebase
SSH into your server and download the latest zip archive:
```bash
# Using wget
wget https://github.com/AadiSPrabs/ui_gotenberg/archive/refs/heads/main.zip
unzip main.zip
cd ui_gotenberg-main
```
*(If you don't have `wget`, you can use `curl -L -O https://github.com/AadiSPrabs/ui_gotenberg/archive/refs/heads/main.zip`)*

### 2. Build the All-in-One Docker Image
Because this image compiles the React frontend inside a builder stage and then packages it with Gotenberg, building it takes a few moments. Run:
```bash
docker build -t gotenberg-ui .
```

### 3. Run the Container
Once the image is built, you can spin it up mapping port `8080` (or any port of your choice) to the container.

**Basic Run:**
```bash
docker run --rm -p 8080:8080 gotenberg-ui
```

**Run in the Background (Detached):**
```bash
docker run -d --name gotenberg-ui --restart unless-stopped -p 8080:8080 gotenberg-ui
```

### 4. Access the UI
Open your web browser and navigate to:
```
http://<YOUR_SERVER_IP>:8080
```
You will be greeted by the premium Gotenberg UI!

---

## Technical Architecture
- **Frontend**: Vite + React, Vanilla CSS
- **Proxy/Routing**: Caddy v2 (internal `8080` -> internal `3000`)
- **Backend API**: The official `gotenberg/gotenberg:8` Docker engine.
