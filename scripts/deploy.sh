#!/bin/bash
# Desactiva la expansión de nombres de archivo y detiene el script si falla un comando
set -ef

# Navegar al directorio raíz del proyecto
cd ~/Estrategia-Blue---Green

# 1. Determinar el color actual y el nuevo color de despliegue
echo "Leyendo estado actual de despliegue..."
CURRENT_COLOR=$(grep CURRENT_DEPLOYMENT front/.env | cut -d '=' -f 2)

if [ "$CURRENT_COLOR" == "blue" ]; then
    NEW_COLOR="green"
elif [ "$CURRENT_COLOR" == "green" ]; then
    NEW_COLOR="blue"
else
    # Si la variable no existe o está vacía, iniciamos en blue
    echo "Estado no válido, iniciando despliegue en BLUE."
    NEW_COLOR="blue"
fi

echo "Desplegando la nueva versión en el entorno INACTIVO: $NEW_COLOR"

# 2. Despliegue ÚNICO de la nueva versión (llama a deploy-blue.sh o deploy-green.sh)
# Esto ejecuta el build y up del nuevo contenedor.
if [ "$NEW_COLOR" == "blue" ]; then
    bash scripts/deploy-blue.sh || exit 1
else
    bash scripts/deploy-green.sh || exit 1
fi
# 🚨 La ejecución aquí debe pasar al siguiente paso sin entrar en un bucle.

# --- Los siguientes pasos se ejecutarán rápidamente, evitando el timeout ---

# 3. Switch de tráfico
echo "Cambiando Nginx para apuntar a: $NEW_COLOR"
bash scripts/switch.sh $NEW_COLOR || exit 1

# 4. Actualizar el .env
sed -i "s/^CURRENT_DEPLOYMENT=.*/CURRENT_DEPLOYMENT=$NEW_COLOR/" front/.env
echo "Estado de CURRENT_DEPLOYMENT actualizado a $NEW_COLOR."

# 5. Reiniciar Nginx para aplicar el cambio y limpiar huérfanos
echo "Reiniciando Nginx y limpiando contenedores antiguos..."
docker compose restart nginx || exit 1
docker compose down --remove-orphans # Limpia los contenedores antiguos (green si desplegamos blue)

echo "✅ Despliegue y Switch a $NEW_COLOR completado con éxito."
