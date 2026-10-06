#!/bin/bash
# Uso: concurrencia.sh <sin|con>   (en tu terminal)
# Lanza las dos peticiones simultáneas a la sala Nogal sobre la base de pruebas, recién recreada,
# sin la restricción de exclusión (sin) o con ella (con), y enseña qué reservas quedaron en la tabla.
source "$(dirname "$0")/comun.sh"
case "${1:-}" in
  sin) MODO=esquema ;;
  con) MODO=restriccion ;;
  *) echo "Uso: concurrencia.sh sin|con"; exit 2 ;;
esac
en_app "$AYUDA/datos.sh datos.ts && node $AYUDA/base.ts pruebas $MODO" > /dev/null
echo "\$ node bin/test.ts   (tests/concurrencia.spec.ts; base de pruebas recién recreada, modo: $MODO)"
en_app "$AYUDA/suite.sh concurrencia.spec.ts"
"$AYUDA/psql.sh" db_pruebas reservas_pruebas "SELECT id, sala, inicio, fin FROM reservas ORDER BY id"
