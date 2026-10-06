#!/bin/bash
# Uso: psql.sh <servicio> <base> "<SQL>"     (en tu terminal, no dentro del contenedor de Node)
# Ejecuta una consulta con psql DENTRO del contenedor de la base, con la hora en UTC para que
# las fechas se vean igual en cualquier máquina. Imprime la consulta y su resultado.
cd "$(dirname "$0")/../../.."
echo "\$ psql -c \"$3\""
docker compose --profile herramientas exec -T -e PGTZ=UTC "$1" psql -U postgres -d "$2" -c "$3" 2>&1
