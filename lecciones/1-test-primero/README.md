# Lección 1 · El test que falla es la especificación que le das al agente

Aquí se reproduce lo que cuenta la lección: dos encargos para la misma regla (dos reservas de la misma sala no pueden solaparse) que dejan escritas dos especificaciones distintas. Un test escrito antes del código, que sale en rojo; una suite de nueve tests escrita leyendo el código, que sale en verde a la primera; y lo que pasa cuando cada suite se ejecuta contra la implementación de la otra y cuando se estropea el borde a propósito.

## Antes de empezar

```sh
make l1
```

Ejecuta los once pasos de esta práctica, uno detrás de otro. Para uno solo: `make l1 PASO=3b`. No hace falta nada más: no usa ninguna base de datos.

## El escenario

Una función `crearReserva(reservas, nueva)` que devuelve una respuesta con `estado` (201 si crea la reserva, 409 si choca con otra de la misma sala) y `cuerpo`. Las horas son texto (`'10:30'`), comparable tal cual. Hay dos encargos:

- **Encargo A** («añade la comprobación de solapamiento y añade tests»): `codigo/01-impl-a.ts` y la suite de nueve tests `tests/t3-suite-a.spec.ts`. Son los que escribió un agente real (Claude Code con Sonnet), guardados tal cual. Rechaza con 409, incluye la reserva ajena en el campo `conflicto` y permite el borde exacto.
- **Encargo B** («escribe un test que falle, no toques el código»): `tests/t2-suite-b.spec.ts`, con tres tests (conflicto, borde permitido, el rechazo no revela el horario ajeno), y `codigo/02-impl-b.ts`, que escribió otro agente al que solo se le dio ese archivo de tests. `tests/t1-nogal.spec.ts` es el primero de los tres, solo.

Este repositorio no llama a ningún agente: lleva sus archivos guardados y los ejecuta.

## Los pasos

**El rojo antes del código**
- `1a` · el test de la sala Nogal contra un esqueleto que acepta todo: `expected 201 to equal 409`.
- `1b` · los tres tests del encargo B contra ese mismo esqueleto: solo el de Nogal en rojo; el del borde y el del horario ya pasaban.

**El verde que no podía salir de otra manera**
- `2a` · la suite de nueve tests del encargo A contra la implementación del encargo A: verde.
- `2b` · tres llamadas a esa implementación, las que contestan las decisiones de producto: el caso del escenario (409 con el campo `conflicto`) y una reserva que empieza a las 11:30 cuando otra acaba a las 11:30 (201).

**Cada suite acepta lo que decidió su origen**
- `3a` · la suite B contra la implementación B: verde.
- `3b` · la suite B contra la implementación A: rojo en «el rechazo no revela el horario de la otra reserva».
- `3c` · la suite A contra la implementación B: dos rojos, los que comparan `conflicto`.

**Estropear el borde a propósito**
- `4a` · en la implementación A, la comparación pasa de `<` a `<=`: la suite A, entera, se pone roja en su test del borde.
- `4b` · lo mismo en la implementación B con la suite B entera: roja en su test del borde.
- `4c` · control: el test de Nogal solo, contra la implementación B sin tocar: verde.
- `4d` · el test de Nogal solo, contra la implementación con el borde estropeado: sigue en verde. Es lo único que pedía el encargo B, y no ve el borde.

`4c` es un control que no publica la lección: sirve para comprobar que el verde de `4d` lo da el test, no una implementación rota por otra cosa.

## Rómpelo tú

Las tres se han ejecutado: lo que pone entre paréntesis es lo que sale. Para probar un cambio, copia el código a un archivo nuevo de `codigo/` y lanza `make par LECCION=1-test-primero CODIGO=<tu-archivo>.ts SUITE=<suite>.spec.ts`.

- **El otro lado del borde.** En una copia de `01-impl-a.ts`, cambia `a.inicio < b.fin` por `a.inicio <= b.fin` y ejecútala con `t3-suite-a.spec.ts` (rojo en «permite reservas consecutivas», que comprueba las dos caras del borde, y ocho en verde). Con `t1-nogal.spec.ts`, el test único, sigue en verde.
- **Olvidar la sala.** En una copia de `02-impl-b.ts`, quita `r.sala === nueva.sala &&`, de modo que cualquier reserva choque con cualquier otra. Con `t1-nogal.spec.ts` y con `t2-suite-b.spec.ts` (los tres tests) todo sigue en verde, porque ninguno pide una sala distinta; con `t3-suite-a.spec.ts` sale en rojo «permite el mismo horario en otra sala» (más dos rojos del campo `conflicto`, que la implementación B no devuelve). Quien escribió primero no pensó en esa pregunta, y la suite de nueve sí la lleva.
- **Contar de más.** En una copia de `02-impl-b.ts`, añade al cuerpo del rechazo la reserva ajena (por ejemplo `conflicto: reservas.find((r) => r.sala === nueva.sala)`) y ejecútala con `t2-suite-b.spec.ts`: rojo solo en «el rechazo no revela el horario de la otra reserva», con `expected '{"error":"La sala ya está reservada e…' to not include '10:30'`.

## Lo que no está aquí

- **Los agentes.** El repositorio no llama a ninguno. `codigo/01-impl-a.ts` y `tests/t3-suite-a.spec.ts` son los de la primera de las tres corridas del encargo A (la suite que cita la lección); las otras dos corridas, que según la lección coinciden en las tres decisiones, no se incluyen. `codigo/02-impl-b.ts` es lo que escribió el agente del encargo B con el archivo de tests intacto.
- **El esqueleto** (`codigo/00-esqueleto.ts`) está escrito para este repositorio: es la función que acepta todo que describe la lección. No es un archivo guardado de las corridas.
- **El ritmo del escenario** (once minutos, los resúmenes finales del agente, el ciclo de dos contextos con skill y subagente) es proceso, no salida de un comando.
- Los tiempos de cada test (`0.85ms`) y la ruta del archivo de tests entre paréntesis cambian en cada ejecución: la comprobación los ignora.
