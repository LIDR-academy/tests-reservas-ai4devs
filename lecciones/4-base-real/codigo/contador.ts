import pg from 'pg'
import { conexion } from './config.ts'

const db = new pg.Client(conexion)
await db.connect()

const insertar = async () =>
  (
    await db.query(
      `INSERT INTO reservas (sala, inicio, fin)
       VALUES ('Nogal', '2026-10-06T10:30:00Z', '2026-10-06T11:30:00Z') RETURNING id`
    )
  ).rows[0].id

await db.query('TRUNCATE reservas RESTART IDENTITY')

await db.query('BEGIN')
console.log('dentro de la transacción, la reserva recibe el id', await insertar())
await db.query('ROLLBACK')

console.log('tras el ROLLBACK, la siguiente recibe el id', await insertar())

await db.query('DELETE FROM reservas')
console.log('tras DELETE FROM reservas, la siguiente recibe el id', await insertar())

await db.query('TRUNCATE reservas')
console.log('tras TRUNCATE reservas, la siguiente recibe el id', await insertar())

await db.query('TRUNCATE reservas RESTART IDENTITY')
console.log('tras TRUNCATE reservas RESTART IDENTITY, la siguiente recibe el id', await insertar())

await db.query('TRUNCATE reservas RESTART IDENTITY')
await db.end()
