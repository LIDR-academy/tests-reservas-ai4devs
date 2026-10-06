#!/bin/bash
# Uso: dos-bases.sh <variante>   (en tu terminal; apaga db_pruebas y la vuelve a levantar al terminar)
#   arriba        las dos bases en marcha, suite bien cableada: pasa y no toca la de trabajo
#   apagada       db_pruebas apagada, suite bien cableada: se cae, y la de trabajo sigue respondiendo
#   mal-cableada  db_pruebas apagada, suite lanzada SIN las variables: pasa... y vacía la de trabajo
#   sin-tablas    db_pruebas arriba pero sin tablas: «relation "reservas" does not exist»
source "$(dirname "$0")/comun.sh"
BIEN="DB_HOST=db_pruebas DB_NOMBRE=reservas_pruebas $AYUDA/suite.sh dos_bases.spec.ts"
MAL="$AYUDA/suite.sh dos_bases.spec.ts"
PREPARA="$AYUDA/datos.sh datos.ts && node $AYUDA/base.ts trabajo con-datos && node $AYUDA/base.ts pruebas esquema"

case "${1:-}" in
  arriba)
    en_app "$PREPARA" > /dev/null
    echo "\$ DB_HOST=db_pruebas DB_NOMBRE=reservas_pruebas node bin/test.ts"
    en_app "$BIEN"
    cuenta_trabajo ;;
  apagada)
    en_app "$PREPARA" > /dev/null
    apagar_pruebas
    echo "\$ DB_HOST=db_pruebas DB_NOMBRE=reservas_pruebas node bin/test.ts"
    en_app "$BIEN"
    cuenta_trabajo ;;
  mal-cableada)
    en_app "$PREPARA" > /dev/null
    apagar_pruebas
    echo "\$ node bin/test.ts   (sin las variables)"
    en_app "$MAL"
    cuenta_trabajo ;;
  sin-tablas)
    en_app "$AYUDA/datos.sh datos.ts && node $AYUDA/base.ts pruebas sin-tablas" > /dev/null
    echo "\$ DB_HOST=db_pruebas DB_NOMBRE=reservas_pruebas node bin/test.ts"
    en_app "$BIEN" ;;
  *) echo "Uso: dos-bases.sh arriba|apagada|mal-cableada|sin-tablas"; exit 2 ;;
esac
