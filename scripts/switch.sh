#!/bin/bash

if [ "$1" == "blue" ]; then
    sed -i 's/green/blue/g' ~/Estrategia-Blue---Green/nginx/default.conf
elif [ "$1" == "green" ]; then
    sed -i 's/blue/green/g' ~/Estrategia-Blue---Green/nginx/default.conf
else
    echo "Uso correcto: ./switch.sh blue | green"
    exit 1
fi

# Reinicia el contenedor de Nginx directamente
docker restart nginx_lb

echo "🔁 Tráfico redirigido a $1 ✓"
