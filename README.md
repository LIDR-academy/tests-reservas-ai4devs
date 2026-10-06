# Tests que pasan sin comprobar nada: banco de comprobación

Los ejemplos de las lecciones de testing del backend (AI4Devs, Módulo 11), listos para ejecutarlos tú. Cada lección enseña una salida real: un test que pasa en verde con el código mal, una cobertura al 100 % con la regla rota, una base de datos fingida que deja pasar una consulta equivocada. Aquí los lanzas con un comando y ves **la misma salida**.

La forma de usarlo: lees la lección, ejecutas su práctica, comparas lo que ves con lo que cuenta la lección y **rompes tú el código** (cada práctica trae sugerencias) para ver el rojo con tus ojos.

## Qué necesitas

- **Docker**, con Docker Compose. En Windows, dentro de Windows Subsystem for Linux (WSL).
- **make** y **git**.

No hace falta instalar Node ni PostgreSQL: todo corre en contenedores (Node 24 y PostgreSQL 17), y las bases no publican ningún puerto.

## Arranque

```sh
git clone https://github.com/LIDR-academy/tests-reservas-ai4devs.git
cd tests-reservas-ai4devs
make l2
```

La primera vez descarga las imágenes y las dependencias, así que tarda un poco. Después, cada práctica tarda unos segundos.

## Las prácticas

| Lección | Qué se comprueba | Comando |
|---|---|---|
| [`1-test-primero`](lecciones/1-test-primero) | Quién llega primero es la especificación del otro: un test en rojo antes del código frente a tests escritos leyendo el código | `make l1` |
| [`2-segundo-caso`](lecciones/2-segundo-caso) | Un atajo que pone el test en verde, y el segundo caso que lo delata | `make l2` |
| [`3-cobertura-contrato`](lecciones/3-cobertura-contrato) | Cobertura al 100 % con la regla rota, y el test que entra por donde entra el cliente | `make l3` |
| [`4-base-real`](lecciones/4-base-real) | Una imitación de la base de datos frente a PostgreSQL de verdad | `make l4` |
| [`5-mantener`](lecciones/5-mantener) | Tests que no deberían existir: el que mira cómo está hecho, el de la cobertura, el intermitente | `make l5` |

Cada carpeta trae un `README.md` con lo que enseña cada paso y cómo romperlo, `codigo/` con las variantes del código, `tests/` con las suites y `pasos.tsv` con los comandos exactos. Para ejecutar un solo paso: `make l2 PASO=1c`.

## Lo que no está aquí

Dos cosas de las lecciones dependen de AdonisJS, y este repositorio usa Japa, el ejecutor de tests que AdonisJS lleva por debajo, sin el framework:

- La orden `node ace test unit` y las suites `unit` y `functional` configuradas de fábrica. Aquí se reproduce lo que importa (un nivel vacío imprime `NO TESTS EXECUTED` y sale con código 0) con las mismas dos suites, pero la orden es `node bin/test.ts`.
- El punto de guardado que genera Lucid, la capa de base de datos de AdonisJS, en la lección 4. Con `BEGIN` y `COMMIT` escritos a mano sí se reproduce.

Las dos las verás en el proyecto del ejercicio del módulo.

## Si algo no coincide con la lección

```sh
make verificar
```

Ejecuta todos los pasos y comprueba que cada salida contiene, en orden, las líneas que publica su lección. Los tiempos, las direcciones y los puertos se ignoran porque cambian en cada ejecución. Si una lección cambia sus ejemplos y este repositorio no, aquí sale en rojo.

## Si rompes algo

```sh
make reset
```

Apaga las bases, borra sus datos y las dependencias instaladas.
