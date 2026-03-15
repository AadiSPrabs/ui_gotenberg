#!/bin/bash

# Start Caddy in the background
echo "Starting Caddy on port 8080..."
caddy run --config /etc/caddy/Caddyfile &

# Start Gotenberg in the foreground using its standard binary
echo "Starting Gotenberg..."
exec gotenberg "$@"
