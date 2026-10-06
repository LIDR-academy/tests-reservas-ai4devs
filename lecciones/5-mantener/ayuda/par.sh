#!/bin/sh
# Uso: par.sh <código.ts> <módulo.ts> <suite.spec.ts>
# Copia una variante de codigo/ al sitio donde la leen los tests (src/<módulo>.ts, que git ignora)
# y ejecuta una suite con Japa. Dos variables de entorno opcionales:
#   COBERTURA=1          envuelve la ejecución en `c8 --reporter=text`, limitado al módulo
#   AHORA=2026-10-05T10:00:00   fija el reloj del proceso (ayuda/simular-ahora.ts, cargado con --import)
# Se lanza desde la raíz del repositorio (dentro del contenedor, /repo).
set -e
L=lecciones/5-mantener
mkdir -p "$L/src"
cp "$L/codigo/$1" "$L/src/$2"
export SPEC="$L/tests/$3"
IMPORTAR=""
[ -n "${AHORA:-}" ] && IMPORTAR="--import ./$L/ayuda/simular-ahora.ts"
if [ -n "${COBERTURA:-}" ]; then
  # c8 local (sin npx: así no avisa de versiones de npm); el directorio temporal de c8 va dentro de la lección: así no pisa el de otra práctica que corra a la vez
  exec ./node_modules/.bin/c8 --include="$L/src/$2" --reporter=text --temp-directory="$L/.tmp/c8" --reports-dir="$L/.tmp/informe" node $IMPORTAR bin/test.ts
else
  exec node $IMPORTAR bin/test.ts
fi
