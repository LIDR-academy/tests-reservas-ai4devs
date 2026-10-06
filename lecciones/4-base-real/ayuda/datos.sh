#!/bin/sh
# Uso: datos.sh <datos.ts | datos.mala.ts>
# Pone la variante elegida de la capa de datos donde la leen los tests (lecciones/4-base-real/src/datos.ts).
# datos.ts lleva la consulta correcta; datos.mala.ts, la de los extremos intercambiados.
set -e
D="$(dirname "$0")/.."
mkdir -p "$D/src"
cp "$D/codigo/$1" "$D/src/datos.ts"
