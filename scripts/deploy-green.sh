#!/bin/bash
echo "🚀 Deploy GREEN (Frontend)"

# Usar 'docker compose' y enfocarse solo en el frontend_green

docker compose stop frontend_green
docker compose rm -f frontend_green
docker compose build frontend_green
docker compose up -d frontend_green

echo "GREEN listo ✓"
