#!/bin/bash

if [ "$1" == "blue" ]; then
    sed -i 's/green/blue/g' nginx/default.conf
elif [ "$1" == "green" ]; then
    sed -i 's/blue/green/g' nginx/default.conf
else
    echo "Uso correcto: ./switch.sh blue | green"
    exit 1
fi

docker-compose restart nginx

echo "🔁 Tráfico redirigido a $1 ✓"