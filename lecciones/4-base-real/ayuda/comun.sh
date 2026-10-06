# Funciones compartidas por los scripts de esta carpeta (se cargan con «source»).
cd "$(dirname "${BASH_SOURCE[0]}")/../../.."
DC="docker compose --profile herramientas"
AYUDA=lecciones/4-base-real/ayuda

# Ejecuta un comando dentro del contenedor de Node, con su salida y sus errores juntos.
en_app() { $DC run --rm -T app sh -c "($1) 2>&1" 2>/dev/null; }

# Lo que ve la base de trabajo: cuántas salas y cuántas reservas guarda.
cuenta_trabajo() {
  "$AYUDA/psql.sh" db reservas_trabajo \
    "SELECT (SELECT count(*) FROM salas) AS salas, (SELECT count(*) FROM reservas) AS reservas"
}

# Apaga SOLO la base de pruebas. Al salir del script (aunque algo falle por el camino) la vuelve a levantar.
apagar_pruebas() {
  trap 'echo "(se vuelve a levantar db_pruebas)"; $DC up -d --wait db_pruebas > /dev/null 2>&1' EXIT
  $DC stop db_pruebas > /dev/null 2>&1
  echo "(db_pruebas apagada; db sigue en marcha)"
}
