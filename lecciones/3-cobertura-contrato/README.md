# Lección 3 · Cubrir todo el código no es cubrir lo que el cliente consume

Aquí se reproduce lo que cuenta la lección: una regla de cancelación con ocho tests en verde y la cobertura al 100 %, que lleva un mes muerta porque la hora de la reserva llega de PostgreSQL como un objeto `Date` y no como el texto con el que la probaron. El test de contrato, que entra por donde entra el cliente, la pone en rojo a la primera.

## Antes de empezar

```sh
make l3
```

Ejecuta los catorce pasos de esta práctica, uno detrás de otro. Para uno solo: `make l3 PASO=1d`. Usa PostgreSQL (el servicio `db`, que `make l3` levanta solo) y únicamente el esquema `leccion3` de la base de trabajo: cada paso que lo necesita lo borra y lo recrea al empezar, así que se puede repetir sin arrastrar nada.

## El escenario

Una regla de reservas de salas: cancelar con menos de dos horas de antelación cuenta como cancelación tardía. El código es la función `esCancelacionTardia(horaReserva, ahora)`, en tres variantes (carpeta `codigo/`):

- `regla.ts`: la del equipo, que compara dos textos.
- `regla-corregida.ts`: la misma, construyendo un objeto de fecha con lo que llegue.
- `regla-umbral-mal.ts`: la corregida, pero con 30 minutos en lugar de dos horas.

Alrededor, un servidor HTTP mínimo de Node (`codigo/servidor.ts`) con una ruta que lee la reserva de la base y llama a la regla, y las suites de `tests/`: los ocho casos de la regla sola, el test de contrato y el test de contrato del diagnóstico.

Cada paso monta en `.tmp/l3-<modo>/` un proyecto pequeño con la variante que toca (lo hace `ayuda/proyecto.sh`) y ejecuta ahí las suites con el mismo `bin/test.ts` del repositorio. Así el informe de cobertura sale como el de la lección, con `regla.ts` en la raíz.

## Los pasos

**El escenario: cien por cien sobre una regla muerta**
- `1a` · los ocho tests de la regla, pasándole textos: verde.
- `1b` · la misma orden con `c8`: el informe da 100 % en las cuatro columnas.
- `1c` · la misma regla leyendo la hora de PostgreSQL: llega un `Date` y contesta `false`; con `toISOString()`, `true`.
- `1e` · por qué: un `Date` frente a un texto no da error, da `false`, porque el texto convertido a número es `NaN`.

**El test que entra por el servidor**
- `1d` · el test de contrato, con un servidor HTTP mínimo arrancado de verdad: `expected false to be true` en la primera ejecución.
- `1f` y `1g` · con la regla corregida, el contrato y los ocho unitarios están en verde.

**Un nivel vacío no sale en rojo**
- `2a` · la suite `unit` sin tests imprime `NO TESTS EXECUTED` y sale con código 0.
- `2b` · con un test que falla, sale con 1.
- `2c` · con los ocho que pasan, sale con 0: el mismo código que la vacía.

**Un test de arriba en rojo a veces no dice qué pieza falló**
- `3a` · avería 1, sin el token de sesión: el permiso rechaza con un 401 y el mensaje lo dice.
- `3b` · avería 2, el umbral escrito con 30 minutos: `expected false to be true`.
- `3c` · avería 3, el `Date` de la base: la misma salida que la 3b.
- `3d` · los ocho unitarios con el umbral mal escrito: tres en rojo, cada uno con su nombre. Con el `Date` de la base, en cambio, siguen los ocho en verde (es el paso `1a`: a la regla solo se le pasan textos).

Las salidas de `1e`, `1f` y `1g` no están impresas en la lección: sus líneas de `esperado/` salen de lo que imprime el repositorio.

## Rómpelo tú

Las tres las ha ejecutado quien escribió este README, y esto es lo que se ve.

- En `codigo/regla.ts` cambia `horaReserva < limite` por `horaReserva <= limite` y ejecuta el paso `1a`: se pone en rojo el test «dos horas justas no es tardía» (`expected true to be false`), y los otros siete siguen en verde. Ahora ejecuta `1b`: aunque hay un test en rojo, el informe sigue dando 100 % en regla.ts. La cobertura no sabe si los tests pasan, solo qué líneas se ejecutaron.
- En `tests/regla.spec.ts` añade, dentro del grupo, un test que le pase a la regla un `Date`: `assert.isTrue(esCancelacionTardia(new Date('2026-10-05T11:30:00.000Z') as any, ahora))`. Con el paso `1a` (la regla del equipo) se pone en rojo con `expected false to be true`; con el `1g` (la corregida) pasan los nueve. Es el test que el equipo no escribió: lo eligió quien sabe lo que llega de verdad.
- En `codigo/servidor.ts` cambia el nombre del campo de la respuesta, de `cancelacionTardia` a `tardia: cancelacionTardia`, y ejecuta el paso `1f` (con la regla ya corregida): el contrato se pone en rojo con `expected undefined to be true`. Es lo que la lección llama «el nombre del campo que sale en la respuesta», que ningún test de la regla sola puede ver. Y el paso `1g` sigue en verde.

## Lo que no está aquí

La lección se midió sobre un proyecto AdonisJS con PostgreSQL. Aquí se reproduce todo lo que no depende del framework y se deja fuera, sin simularlo, esto:

- **La sección de los tiempos** (los ocho casos por la ruta contra los ocho de la regla sola, la cuenta con contraseña cifrada y el cronometrado paso a paso). Se midió en un proyecto con inicio de sesión real; un servidor mínimo sin login no tiene esos costes, y cualquier cifra que saliera de aquí no sería la de la lección.
- **La comprobación de que una suite `unit` que hace peticiones falla con `AggregateError`.** Depende del archivo de arranque de AdonisJS, que decide qué suites arrancan el servidor.
- **La orden `node ace test`.** Aquí es `node bin/test.ts`, con el mismo Japa por debajo y las mismas suites `unit` y `functional` de fábrica. El servidor del contrato es un `http.createServer` de Node, no una aplicación de AdonisJS, y los tests de contrato entran por él con `fetch`.
