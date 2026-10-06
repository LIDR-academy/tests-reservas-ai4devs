#!/bin/sh
# Uso: par.sh <lección> <código.ts> <suite.spec.ts>
# Copia una variante del código de la lección al sitio donde la leen sus tests
# (lecciones/<lección>/src/reservas.ts) y ejecuta una suite con Japa.
# Es lo que hacen los pasos de las lecciones 2 y 5; también se puede lanzar a mano.
set -e
L="lecciones/$1"
mkdir -p "$L/src"
cp "$L/codigo/$2" "$L/src/reservas.ts"
SPEC="$L/tests/$3" node bin/test.ts
