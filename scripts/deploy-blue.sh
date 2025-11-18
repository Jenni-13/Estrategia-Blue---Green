#!/bin/bash
echo "🚀 Deploy BLUE"

docker-compose stop frontend_blue backend_blue
docker-compose rm -f frontend_blue backend_blue
docker-compose build frontend_blue backend_blue
docker-compose up -d frontend_blue backend_blue

echo "BLUE listo ✓"
