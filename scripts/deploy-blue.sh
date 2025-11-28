#!/bin/bash
echo "🚀 Deploy BLUE (Frontend)"

# Usar 'docker compose' y enfocarse solo en el frontend_blue

docker compose stop frontend_blue
docker compose rm -f frontend_blue
docker compose build frontend_blue
# El -d es crucial para que el script no se quede esperando.
docker compose up -d frontend_blue

echo "BLUE listo ✓"
