#!/bin/bash
# Uso: correr.sh <carpeta-de-lección> [paso] [--silencioso]
# Ejecuta los pasos de lecciones/<carpeta>/pasos.tsv (columnas separadas por tabulador:
# id, dónde, descripción, comando) y guarda la salida de cada uno en .salidas/<carpeta>/<id>.txt.
#   dónde = app   se ejecuta dentro del contenedor de Node
#   dónde = host  se ejecuta en tu terminal (los pasos que apagan una base)
set -u
cd "$(dirname "$0")/.."
LECCION="$1"; PASO="${2:-}"; SILENCIO="${3:-}"
DIR="lecciones/$LECCION"
[ -f "$DIR/pasos.tsv" ] || { echo "✗ No existe $DIR/pasos.tsv"; exit 2; }
DC="docker compose --profile herramientas"
mkdir -p ".salidas/$LECCION"

# necesita-bases: el archivo lista los servicios que hay que levantar (db, db_pruebas o los dos)
if [ -f "$DIR/necesita-bases" ]; then
  $DC up -d --wait $(cat "$DIR/necesita-bases") > /dev/null 2>&1 || { echo "✗ No se pudieron levantar las bases (¿está Docker en marcha?)"; exit 2; }
fi

while IFS=$'\t' read -r id donde desc cmd; do
  case "$id" in ''|'#'*) continue;; esac
  [ -n "$PASO" ] && [ "$PASO" != "$id" ] && continue
  out=".salidas/$LECCION/$id.txt"
  [ "$SILENCIO" = "--silencioso" ] || { echo; echo "▶ $id · $desc"; echo "\$ $cmd"; }
  {
    echo "\$ $cmd"
    if [ "$donde" = "host" ]; then
      bash -c "$cmd" 2>&1; codigo=$?
    else
      $DC run --rm -T app sh -c "($cmd) 2>&1" 2>/dev/null; codigo=$?
    fi
    echo "[código de salida: $codigo]"
  } | sed -E "s/$(printf '\033')\[[0-9;]*m//g" > "$out"
  [ "$SILENCIO" = "--silencioso" ] || cat "$out" | sed '1d'
done < "$DIR/pasos.tsv"
