# Stage 1: Build the Vite React App
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Final Image (Gotenberg + Caddy + Built UI)
FROM gotenberg/gotenberg:8

USER root

# Install Caddy
RUN apt-get update && apt-get install -y curl && \
    curl -L "https://caddyserver.com/api/download?os=linux&arch=amd64" -o /usr/bin/caddy && \
    chmod +x /usr/bin/caddy && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the built React app from the builder stage
COPY --from=builder /app/dist /srv

# Copy our Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Create and configure startup script
COPY start.sh /start.sh

# Set correct permissions
RUN chmod +x /start.sh && \
    chown -R gotenberg:gotenberg /srv && \
    chown -R gotenberg:gotenberg /etc/caddy && \
    chown gotenberg:gotenberg /start.sh && \
    mkdir -p /home/gotenberg/.local/share/caddy && \
    chown -R gotenberg:gotenberg /home/gotenberg

USER gotenberg

EXPOSE 8080

ENTRYPOINT [ "/start.sh" ]
