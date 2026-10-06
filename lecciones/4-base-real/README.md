# Lección 4 · La base de datos de los tests no se finge

Aquí se reproduce lo que cuenta la lección: una imitación de la base de datos pone en verde una consulta equivocada que PostgreSQL de verdad delata; dos peticiones simultáneas que solo una restricción de la base puede frenar; las dos bases (trabajo y pruebas) y la comprobación de apagar solo la de pruebas; qué ve y qué no ve una transacción por test; los contadores de identificadores; y un juego de datos completo que esconde un fallo.

## Antes de empezar

```sh
make l4
```

Ejecuta los diecisiete pasos de esta práctica, uno detrás de otro. Para uno solo: `make l4 PASO=3b`. Necesita las dos bases PostgreSQL (`db`, la de trabajo, y `db_pruebas`, la de pruebas) y `make` las levanta solas.

**Dos pasos apagan `db_pruebas`, `3b` y `3c`**, y los lanza tu terminal (`host`) en vez del contenedor de Node, porque necesitan hablar con Docker. Cada uno la vuelve a levantar al terminar, aunque el paso falle. Cada paso recrea las tablas que usa, así que puedes repetirlos en cualquier orden.

## El escenario

La interfaz de programación de aplicaciones (API) de reservas de salas y su regla: dos reservas de la misma sala no pueden solaparse. El código es `reservar(datos, petición)`, que pregunta a una capa de datos qué reservas se cruzan (`codigo/reservas.ts`, `codigo/datos.ts`), y cada paso la ejecuta contra una suite de `tests/`. Las tablas están en `db/esquema.sql` y la restricción de exclusión en `db/restriccion.sql`.

La consulta mala de la lección (`codigo/datos.mala.ts`) tiene los extremos intercambiados: `inicio < $2 AND fin > $3`. La corregida (`codigo/datos.ts`) es `inicio < $3 AND fin > $2`. Los pasos que cambian de variante copian la elegida a `src/datos.ts`, que es lo que leen los tests.

## Los pasos

**Una imitación solo confirma lo que ya creías**
- `1a` · la imitación con la consulta mala: verde, y la consulta no ha corrido.
- `1b` · la misma consulta mala contra PostgreSQL: rojo.
- `1c` · la consulta corregida contra PostgreSQL: verde.
- `1d` · la imitación con la consulta corregida: verde igual, no distingue.

**Lo que ninguna consulta garantiza lo arbitra una restricción**
- `2a` · dos peticiones simultáneas sin restricción: quedan dos reservas solapadas (la salida del test y la tabla, con `psql` dentro del contenedor de la base).
- `2b` · las mismas con `EXCLUDE USING gist`: la segunda la rechaza el motor.

**Dos bases, y se comprueba apagando una**
- `3a` · el punto de partida: las dos arriba, suite bien cableada, la de trabajo intacta (2 salas, 3 reservas).
- `3b` · se apaga solo la de pruebas: la suite se cae y la de trabajo sigue respondiendo.
- `3c` · cableado roto (la suite sin las variables) con la de pruebas apagada: pasa, y vacía la de trabajo (1 sala, 1 reserva).
- `3d` · una base de pruebas que perdió sus tablas: `relation "reservas" does not exist`.

**Una transacción por test**
- `4a` · el informe, que abre su propia conexión, ve la base vacía: el mensaje no menciona ninguna transacción.
- `4b` · el mismo test vaciando tablas entre tests: pasa.
- `4c` · `BEGIN` y `COMMIT` escritos a mano: los avisos del motor y las 2 reservas que ve otra conexión tras el `ROLLBACK`. (Por debajo, el mismo script prueba la variante con `SAVEPOINT` escrito a mano, que sí se deshace con el test.)
- `4d` · los contadores: 1, 2 tras `ROLLBACK`, 3 tras `DELETE`, 4 tras `TRUNCATE`, y solo `TRUNCATE … RESTART IDENTITY` devuelve el 1.

**Un fixture completo esconde el fallo**
- `5a` · juego de datos común frente a datos mínimos: el común pasa, el mínimo cae con `TypeError … 'toLocaleString'`.
- `5b` · se borra el aforo de Cedro del juego común: el test del juego común también cae.
- `5c` · se borra el aforo de Nogal: sigue en verde, ese campo era ruido.

## Rómpelo tú

Todas se han ejecutado y se ve lo que dice cada una. Después de cada una, deshaz el cambio.

- **La restricción solo frena la misma sala.** En `tests/concurrencia.spec.ts` cambia `sala: 'Nogal'` por `sala: 'Cedro'` en `segunda` y ejecuta el paso `2b`. Con la restricción puesta, el test sigue en rojo: las dos peticiones salen `{ ok: true }` y la tabla acaba con Nogal y Cedro solapadas en el tiempo, porque `sala WITH =` solo compara filas de la misma sala.
- **Ningún test da por hecho un identificador.** En `tests/visibilidad_vaciando.spec.ts` deja dos tests idénticos (copia el test y cambia su título) que inserten una reserva con `RETURNING id` y comprueben `assert.equal(rows[0].id, 1)`, y ejecuta el paso `4b`. El primero pasa y el segundo cae con `expected 2 to equal 1`: `TRUNCATE reservas` a secas no reinicia el contador.
- **Una prueba de treinta segundos: borra un campo del juego de datos común.** En `tests/fixture.spec.ts` cambia el aforo de Arce (`('Arce', 20)`) por `NULL` y ejecuta el paso `5a`: ahora cae también el test del juego común, con el mismo `TypeError`. Es lo que el aforo de Arce tapaba.

## Lo que no está aquí

Dos cosas de la lección dependen de AdonisJS y este repositorio usa Japa y `pg` sin el framework:

- La variante con **Lucid**: `beginGlobalTransaction`, `db.transaction()` anidadas, y las sentencias `SAVEPOINT trx3` / `RELEASE SAVEPOINT` / `ROLLBACK TO SAVEPOINT` que el servidor registra. Lo más cercano que sí hay aquí es el `SAVEPOINT` escrito a mano de `4c`.
- El comando de vaciado de tablas de Lucid, **`db:truncate`**, y la medida de que tampoco reinicia los contadores.

Y una más, por una dependencia que este repositorio no trae:

- **La fecha en SQLite frente a PostgreSQL** (la pregunta «¿Y si la base de pruebas es de otro motor?»): necesita `better-sqlite3`, que no está en `package.json` de este repositorio.

Las dos primeras las verás en el proyecto del ejercicio del módulo.

## Qué ve este repositorio distinto a la lección

Con la base apagada, la suite imprime `getaddrinfo ENOTFOUND db_pruebas` y no `ECONNREFUSED`: aquí las bases son servicios de Docker Compose, y al pararse el contenedor su nombre deja de existir. La lección menciona los dos mensajes; en los dos la suite se cae sin poder conectarse.
