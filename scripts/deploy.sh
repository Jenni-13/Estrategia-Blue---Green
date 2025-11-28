#!/bin/bash
set -e # Detiene el script inmediatamente si falla algún comando

cd ~/Estrategia-Blue---Green

# 1. Determinar el nuevo color
CURRENT_COLOR=$(grep CURRENT_DEPLOYMENT front/.env | cut -d '=' -f 2)

if [ "$CURRENT_COLOR" == "blue" ]; then
    NEW_COLOR="green"
elif [ "$CURRENT_COLOR" == "green" ]; then
    NEW_COLOR="blue"
else
    echo "Estado no válido, usando BLUE."
    NEW_COLOR="blue"
fi

echo "Iniciando despliegue de la versión: $NEW_COLOR (Esto puede tardar 5-10 minutos...)"

# 2. Despliegue ÚNICO (Llama a deploy-blue.sh o deploy-green.sh)
if [ "$NEW_COLOR" == "blue" ]; then
    bash scripts/deploy-blue.sh || exit 1
else
    bash scripts/deploy-green.sh || exit 1
fi
# 🚨 Aquí el script ya debería pasar al siguiente paso 

# 3. Switch de tráfico
echo "Cambiando Nginx para apuntar a: $NEW_COLOR"
bash scripts/switch.sh $NEW_COLOR || exit 1

# 4. Actualizar el .env y reiniciar Nginx
sed -i "s/^CURRENT_DEPLOYMENT=.*/CURRENT_DEPLOYMENT=$NEW_COLOR/" front/.env
echo "Estado de CURRENT_DEPLOYMENT actualizado a $NEW_COLOR."

docker compose restart nginx || exit 1
docker compose down --remove-orphans # Limpieza para la próxima vez

echo "Despliegue y Switch completado con éxito."
