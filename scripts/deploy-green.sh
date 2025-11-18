#!/bin/bash
echo "🚀 Deploy GREEN"

docker-compose stop frontend_green backend_green
docker-compose rm -f frontend_green backend_green
docker-compose build frontend_green backend_green
docker-compose up -d frontend_green backend_green

echo "GREEN listo ✓"
