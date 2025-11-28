#!/bin/bash
set -e

cd ~/Estrategia-Blue---Green

# 1. Leer el estado actual
CURRENT_COLOR=$(grep CURRENT_DEPLOYMENT front/.env | cut -d '=' -f 2)

if [ "$CURRENT_COLOR" == "blue" ]; then
    NEW_COLOR="green"
    PORT="3001"
elif [ "$CURRENT_COLOR" == "green" ]; then
    NEW_COLOR="blue"
    PORT="3000"
else
    echo "ERROR: CURRENT_DEPLOYMENT no válido. Desplegando en Blue por defecto."
    NEW_COLOR="blue"
    PORT="3000"
fi

echo "Desplegando la nueva versión en el entorno: $NEW_COLOR (Puerto $PORT)"

# 2. Despliegue del nuevo entorno (docker compose up -d servicio_nuevo)
# Aquí puedes usar tu script deploy-blue.sh o deploy-green.sh

# Ejemplo simplificado: Usa docker compose up -d $NEW_COLOR
docker compose up -d frontend_$NEW_COLOR

# 3. Health Check (Opción simplificada)
echo "Realizando Health Check en puerto interno 80..."
docker ps | grep frontend_$NEW_COLOR || exit 1

# 4. Switch de tráfico
bash scripts/switch.sh $NEW_COLOR

# 5. Actualizar el .env
sed -i "s/^CURRENT_DEPLOYMENT=.*/CURRENT_DEPLOYMENT=$NEW_COLOR/" front/.env
echo "Estado de CURRENT_DEPLOYMENT actualizado a $NEW_COLOR."

# Forzar reinicio de Nginx (para mayor seguridad)
docker compose restart nginx
