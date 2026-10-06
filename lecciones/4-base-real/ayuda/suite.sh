#!/bin/sh
# Uso: suite.sh <archivo.spec.ts>   (los archivos están en lecciones/4-base-real/tests/)
# Ejecuta una suite con Japa y el reporter de puntos, que es el que enseña la lección (✔ y ✖ seguidos).
# Se lanza desde la raíz del repositorio.
SPEC="lecciones/4-base-real/tests/$1" node bin/test.ts --reporters=dot
