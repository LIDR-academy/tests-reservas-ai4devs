# Lección 5 · Escribir un test cuesta cero, mantenerlo no

Aquí se reproducen los ejemplos de la lección con salida ejecutada: un 100 % de cobertura que no distingue una suite de comprobaciones de una suite vacía, un test que mira cómo está hecho el código y se pone rojo sin que nadie haya roto nada, un test que pasa o falla según la hora, y unos tests regenerados desde el código que defienden el fallo.

## Antes de empezar

```sh
make l5
```

Ejecuta los quince pasos de esta práctica, uno detrás de otro. Para uno solo: `make l5 PASO=1a`. No hace falta nada más: no usa ninguna base de datos.

## El escenario

Una API de reservas de salas, con tres trocitos de código (carpeta `codigo/`, con variantes del mismo archivo) y las suites que los comprueban (carpeta `tests/`). Cada paso copia una variante a `src/` (que git ignora) y ejecuta una suite con Japa. El script que lo hace es `ayuda/par.sh`: si le pones delante `COBERTURA=1` mide la cobertura con `c8`, y si le pones `AHORA=2026-10-05T10:00:00` fija el reloj del proceso con `ayuda/simular-ahora.ts` (el archivo corto que la lección dice que no muestra, cargado con `node --import`).

## Los pasos

**El informe de cobertura da 100 % con tests que afirman y con tests que no**
- `1a` · cuatro tests escritos a mano, sin ninguna afirmación sobre lo que devuelve la regla, contra la regla sana: verdes y 100 % en las cuatro columnas.
- `1b` · los mismos cuatro con la condición del aforo invertida (`personas <= sala.aforoMax`): siguen verdes y el informe es idéntico.
- `1c` · tres tests escritos desde la regla contra la condición invertida: dos rojos.
- `1d` · esos mismos tres sobre la regla sana: verdes, y la cobertura baja al 86,66 % porque ninguno toca `plazasLibres`.
- `2a` y `2b` · los nueve tests con afirmaciones que escribió un agente real (se guardaron: no se vuelve a lanzar ningún agente). Sobre la regla sana, verdes y el mismo 100 %. Con la condición invertida, tres rojos y el mismo 100 %.

**El detalle de implementación**
- `3a` · un espía sobre `horasHasta` y dos tests de salida, con el código original: tres verdes.
- `3b` · el refactor que mete la cuenta dentro de `cancelar` (la regla devuelve lo mismo): el espía se pone rojo (`The argument 'methodName' must be a method`) y los dos de salida siguen verdes. Es el rojo falso.
- `3c` · la resta de `horasHasta` al revés (el reembolso sí se rompe): el espía sigue verde y el de 30 horas se pone rojo.

**El intermitente por la hora**
- `4a` y `4b` · el mismo test, que lee el reloj del sistema, con el reloj a las 10:00 (verde) y a las 22:00 (rojo).
- `4c` y `4d` · los dos tests que fijan la hora ellos mismos pasan con los dos relojes.

**Regenerar los tests desde el código copia también su fallo**
- `5a` · el código tiene `>` donde debía ir `>=`. Los nueve tests que regeneró un agente real desde ese código pasan, y uno afirma que con 24 horas justas se devuelve 0.
- `5b` · el test escrito desde la regla (24 horas justas se devuelve todo) falla: `expected +0 to equal 80`.

## Rómpelo tú

Cada una la ejecuté antes de escribirla. Después de probar, deja el archivo como estaba.

- En `codigo/aforo-sano.ts` cambia `personas > sala.aforoMax` por `personas >= sala.aforoMax` (un error de uno en el borde) y ejecuta `make l5 PASO=1a`: los cuatro tests sin afirmaciones siguen verdes y el informe sigue al 100 %. Ahora `make l5 PASO=2a`: el test del agente que prueba «las personas igualan el aforo» se pone rojo (`8 passed, 1 failed`) y la cobertura sigue al 100 %.
- En `codigo/horario.ts` cambia `hora >= 8` por `hora > 8` y añade al final de `tests/hora-reloj-fijado.spec.ts` un tercer test: `test('a las 08:00 en punto la sala Nogal está abierta', ({ assert }) => { assert.isTrue(estaAbierta(new Date(2026, 9, 5, 8, 0))) })`. Ejecuta `make l5 PASO=4c`: los dos tests de 10:00 y 22:00 siguen verdes y el nuevo cae. Es el segundo caso de la lección anterior, ahora sobre la hora.
- En `codigo/reembolso-estricto.ts` corrige el fallo (`horasDeMargen >= 24`) y ejecuta `make l5 PASO=5a` y `make l5 PASO=5b`: ahora el que se pone rojo es el test que regeneró el agente (`expected 100 to equal +0`), y el de la regla pasa a verde. Los tests regenerados defendían el fallo.

## Lo que no está aquí

- **Los agentes reales.** Los tests de `2a`/`2b` y `5a` son los que escribió un agente (Sonnet 5.5, una ejecución, con solo el código delante) y están guardados tal cual en `tests/cobertura-agente.spec.ts` y `tests/regenerar-agente.spec.ts`; solo cambié la ruta de la importación (`'./aforo.ts'` pasa a `'../src/aforo.ts'`, y lo mismo con `cancelar.ts`). Los prompts que se les dieron están en `ayuda/prompt-subir-cobertura.txt` y `ayuda/prompt-regenerar.txt` por si quieres lanzarlos tú con tu agente: lo que escriba será distinto, porque la redacción y el número de tests de una ejecución no son un contrato.
- **El intermitente por el orden de ejecución** (alguien no limpió lo que sembró): la lección lo nombra pero no enseña salida. Y **el inventario de una tarde con `git log`**: depende del historial de un proyecto real, y un historial de juguete no enseñaría nada que la lección no diga.
- **Los comandos de AdonisJS.** La lección usa `node bin/test.ts`, que aquí es lo mismo (Japa sin el framework); `npx c8 …` se lanza dentro de `ayuda/par.sh` con el `c8` de `node_modules` y con la carpeta temporal dentro de esta lección, para no pisar otra práctica que mida cobertura a la vez.
- Lo que `esperado/` exige en `1d`, `2a`, `2b` y `5a` son las cifras que la lección da en prosa (86,66 %, nueve tests, tres rojos, el test de las 24 horas), no un bloque literal.
