// Deja una de las dos bases en el estado que pide el paso (borra y recrea: se puede repetir).
// Uso (dentro del contenedor):  node lecciones/4-base-real/ayuda/base.ts <pruebas|trabajo> <modo>
//   esquema       las tablas salas y reservas, vacías
//   restriccion   lo mismo, más la restricción de exclusión que impide solapamientos
//   sin-tablas    ninguna tabla (una base que se reinició y perdió el esqueleto)
//   con-datos     el esquema, más los datos de juguete de la base de trabajo: 2 salas y 3 reservas
import pg from 'pg'
import { readFileSync } from 'node:fs'

const [, , cual, modo = 'esquema'] = process.argv
const trabajo = cual === 'trabajo'
const db = new pg.Client({
  host: trabajo ? process.env.HOST_TRABAJO : process.env.HOST_PRUEBAS,
  port: 5432,
  user: 'postgres',
  password: 'x',
  database: trabajo ? 'reservas_trabajo' : 'reservas_pruebas',
})
const sql = (archivo: string) => readFileSync(new URL(`../db/${archivo}`, import.meta.url), 'utf8')

await db.connect()
await db.query('DROP TABLE IF EXISTS reservas, salas CASCADE')
if (modo !== 'sin-tablas') await db.query(sql('esquema.sql'))
if (modo === 'restriccion') await db.query(sql('restriccion.sql'))
if (modo === 'con-datos') {
  await db.query(`INSERT INTO salas (nombre, aforo) VALUES ('Nogal', 12), ('Cedro', 6)`)
  await db.query(
    `INSERT INTO reservas (sala, inicio, fin) VALUES
       ('Nogal', '2026-09-28T09:00:00Z', '2026-09-28T10:00:00Z'),
       ('Nogal', '2026-09-29T11:00:00Z', '2026-09-29T12:00:00Z'),
       ('Cedro', '2026-09-30T15:00:00Z', '2026-09-30T16:00:00Z')`
  )
}
await db.end()
