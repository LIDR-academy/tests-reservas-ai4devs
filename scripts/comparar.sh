#!/bin/sh
# Uso: comparar.sh <salida-real> <esperado>
# Comprueba que CADA línea de <esperado> aparece en <salida-real>, en el mismo orden. Las
# lecciones publican las salidas recortadas (sin la pila de llamadas, sin las líneas de arranque),
# así que se compara con «contiene, en orden» y no con una igualdad exacta.
# Antes de comparar se quitan los colores y se sustituyen los valores que cambian en cada
# ejecución (tiempos, direcciones IP y puertos) por marcadores.
ESC=$(printf '\033')
normalizar() {
  sed -E \
    -e "s/${ESC}\[[0-9;]*m//g" \
    -e 's/\([^)]*\.spec\.ts\)/(<archivo>)/g' \
    -e 's/[0-9]+(\.[0-9]+)?(ms|s)([^a-zA-Z]|$)/<t>\3/g' \
    -e 's/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:[0-9]+/<dir>:<puerto>/g' \
    -e 's/[[:space:]]+$//' "$1" | grep -v '^[[:space:]]*$'
}
normalizar "$1" > "$1.n"
normalizar "$2" > "$2.n"
awk '
  NR == FNR { real[++n] = $0; next }
  { esperado[++m] = $0 }
  END {
    j = 1; fallo = 0
    for (i = 1; i <= m; i++) {
      while (j <= n && real[j] != esperado[i]) j++
      if (j > n) { print "  ✗ falta, o está fuera de orden: " esperado[i]; fallo = 1; break }
      j++
    }
    exit fallo
  }
' "$1.n" "$2.n"
r=$?
rm -f "$1.n" "$2.n"
exit $r
