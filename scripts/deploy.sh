#!/bin/bash
set -e

cd ~/Estrategia-Blue---Green

# 1. Leer el estado actual para determinar el nuevo color
CURRENT_COLOR=$(grep CURRENT_DEPLOYMENT front/.env | cut -d '=' -f 2)

if [ "$CURRENT_COLOR" == "blue" ]; then
    NEW_COLOR="green"
elif [ "$CURRENT_COLOR" == "green" ]; then
    NEW_COLOR="blue"
else
    # Fallback si .env está vacío
    echo "ERROR: CURRENT_DEPLOYMENT no encontrado. Desplegando en BLUE por defecto."
    NEW_COLOR="blue"
fi

echo "Desplegando la nueva versión en el entorno INACTIVO: $NEW_COLOR"

# 2. Despliegue del nuevo entorno (Llamada ÚNICA)
# Esto ejecuta tu deploy-blue.sh o deploy-green.sh (que ya corrigiste)
if [ "$NEW_COLOR" == "blue" ]; then
    bash scripts/deploy-blue.sh
else
    bash scripts/deploy-green.sh
fi

# 3. Health Check (Verificación ÚNICA, solo confirma que el contenedor está vivo)
echo "Realizando Health Check: verificando que frontend_$NEW_COLOR esté UP..."
docker ps | grep frontend_$NEW_COLOR || exit 1

# 4. Switch de tráfico
echo "Cambiando Nginx para apuntar a: $NEW_COLOR"
bash scripts/switch.sh $NEW_COLOR

# 5. Actualizar el .env
sed -i "s/^CURRENT_DEPLOYMENT=.*/CURRENT_DEPLOYMENT=$NEW_COLOR/" front/.env
echo "Estado de CURRENT_DEPLOYMENT actualizado a $NEW_COLOR."

# 6. Reiniciar Nginx para aplicar el cambio de tráfico y limpiar huérfanos
docker compose restart nginx
docker compose down --remove-orphans # Ayuda a que los futuros deploys sean más rápidos
