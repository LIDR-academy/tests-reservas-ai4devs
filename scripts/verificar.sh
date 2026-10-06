#!/bin/bash
# Uso: verificar.sh [carpeta-de-lección]   (sin argumento, todas)
# Ejecuta los pasos de todas las lecciones y comprueba que cada salida contiene, en orden,
# las líneas que publica la lección (lecciones/<carpeta>/esperado/<paso>.txt). Si una lección
# cambia sus ejemplos y este repositorio no, aquí sale en rojo.
set -u
cd "$(dirname "$0")/.."
fallos=0; total=0
for dir in lecciones/*/; do
  L=$(basename "$dir")
  [ -n "${1:-}" ] && [ "$1" != "$L" ] && continue
  [ -f "$dir/pasos.tsv" ] || continue
  while IFS=$'\t' read -r id donde desc cmd; do
    case "$id" in ''|'#'*) continue;; esac
    total=$((total+1))
    ./scripts/correr.sh "$L" "$id" --silencioso
    esperado="$dir/esperado/$id.txt"
    if [ ! -f "$esperado" ]; then echo "✗ $L/$id: no hay $esperado"; fallos=$((fallos+1)); continue; fi
    if msg=$(./scripts/comparar.sh ".salidas/$L/$id.txt" "$esperado"); then
      echo "✓ $L/$id"
    else
      echo "✗ $L/$id: la salida no coincide con la de la lección"; echo "$msg"; fallos=$((fallos+1))
    fi
  done < "$dir/pasos.tsv"
done
[ "$fallos" -eq 0 ] && echo "Todo coincide con las lecciones ($total pasos)." || { echo "$fallos de $total pasos con diferencias."; exit 1; }
