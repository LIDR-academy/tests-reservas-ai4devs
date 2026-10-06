# Lección 2 · Del verde falso se sale con un segundo caso

Aquí se reproduce lo que cuenta la lección: un test en rojo se pone en verde con un atajo (`if (asistentes > 6)`), la suite no lo delata, y el segundo caso, con datos que el atajo no puede satisfacer, sí.

## Antes de empezar

```sh
make l2
```

Ejecuta los diecisiete pasos de esta práctica, uno detrás de otro. Para uno solo: `make l2 PASO=1c`. No hace falta nada más: no usa ninguna base de datos.

## El escenario

Una regla de aforo: una sala no admite una reserva para más personas de las que caben. La sala Nogal tiene seis plazas y la Roble doce. El código es la función `reservar(sala, asistentes)`, en varias variantes (carpeta `codigo/`), y cada paso la ejecuta contra una suite (carpeta `tests/`).

## Los pasos

**El recorrido del escenario**
- `1a` · el test de la sala Nogal contra un esqueleto que acepta todo: rojo.
- `1b` · el atajo `if (asistentes > 6)` con ese test: verde.
- `1c` · se añade el test de la sala Roble: el atajo vuelve al rojo.
- `1d` · el aforo se lee de la sala: verde con los dos tests.
- `1e` · una tabla de aforos por nombre también pasa esos dos casos.

**El atajo que no se ve a un kilómetro**
- `2a` · el atajo de la tabla pasa una suite de cuatro casos.
- `2b` · falla con una sala que la suite no menciona, la Cedro.
- `2c` y `2d` · el código general pasa los cuatro casos y también el de la Cedro.

**El detector de treinta segundos**
- `3a`, `3a2` y `3a3` · el umbral del atajo pasa de 6 a 7, a 8 y a 9: solo en el 9 se pone rojo.
- `3b` · el mismo cambio sobre el código general, con dos casos: sigue en verde.
- `3c` · con dos casos más, uno a cada lado del borde: rojo.

**Refactorizar código y tests a la vez**
- `4a` · la suite de cuatro casos pasa entera.
- `4b` · un cambio de código que altera el comportamiento en el borde, con los tests reescritos a la vez: verde.
- `4c` · el mismo cambio con los tests intactos: rojo.

## Rómpelo tú

- En `codigo/02-general.ts` cambia `>` por `>=` y ejecuta el paso `1d`. ¿Se entera la suite de dos casos? Ahora ejecuta ese código contra los casos del borde: `make par LECCION=2-segundo-caso CODIGO=02-general.ts SUITE=t4-borde.spec.ts`.
- En `tests/t1-nogal.spec.ts` añade un test para la sala Cedro con cinco personas y ejecuta el paso `1b`: el atajo cae.
- Escribe tu propio atajo en `codigo/` (una tabla, una cadena de condiciones) y mira cuántos casos necesitas para delatarlo.
