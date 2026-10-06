#!/bin/sh
# Uso (desde la raíz del repositorio): ayuda/proyecto.sh <modo> <regla.ts>
# Monta un proyecto pequeño en .tmp/l3-<modo>/ con la variante de la regla (codigo/<regla.ts>) como
# regla.ts. Así cada paso corre en un directorio limpio, y el informe de cobertura sale como el de la
# lección (con regla.ts en la raíz, sin subcarpetas). Los modos:
#   plano       regla.ts, db.ts, servidor.ts… y tests/ con las suites sueltas (se lanzan con SPEC=…)
#   unit        tests/unit/regla.spec.ts: los ocho casos en una suite llamada «unit»
#   unit-falla  tests/unit/falla.spec.ts: la suite «unit» con un único test que falla
#   vacio       sin tests/: la suite «unit» no tiene nada que ejecutar
set -e
L=lecciones/3-cobertura-contrato
P=.tmp/l3-$1
rm -rf "$P"
mkdir -p "$P"
case "$1" in
  plano)
    cp "$L/codigo/$2" "$P/regla.ts"
    cp "$L"/codigo/db.ts "$L"/codigo/servidor.ts "$L"/codigo/desde-la-base.ts "$L"/codigo/comparar-fecha-y-texto.ts "$P/"
    mkdir "$P/tests"
    cp "$L"/tests/regla.spec.ts "$L"/tests/contrato.spec.ts "$L"/tests/diagnostico.spec.ts "$P/tests/"
    ;;
  unit)
    cp "$L/codigo/$2" "$P/regla.ts"
    mkdir -p "$P/tests/unit"
    # la suite vive una carpeta más abajo, así que el import de la regla sube un nivel más
    sed "s#'../regla.ts'#'../../regla.ts'#" "$L/tests/regla.spec.ts" > "$P/tests/unit/regla.spec.ts"
    ;;
  unit-falla)
    mkdir -p "$P/tests/unit"
    cp "$L/tests/falla.spec.ts" "$P/tests/unit/falla.spec.ts"
    ;;
  vacio)
    ;;
  *)
    echo "modo desconocido: $1" >&2
    exit 2
    ;;
esac
