# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Final stage
FROM caddy:alpine

WORKDIR /app
# Copy built assets
COPY --from=builder /app/dist /usr/share/caddy
# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# The Caddyfile uses port 8080 by default (as seen in current config)
EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
