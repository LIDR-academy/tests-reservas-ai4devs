// Deja la base lista para un paso: borra y recrea el esquema `leccion3` con la tabla `reservas`.
// La lección 3 solo toca ese esquema (la base de trabajo la comparten otras lecciones), y por eso
// cada paso empieza por aquí: así se puede repetir sin arrastrar reservas de la vez anterior.
import pg from 'pg'

const cliente = new pg.Client({
  host: process.env.HOST_TRABAJO,
  port: 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: 'reservas_trabajo',
})
await cliente.connect()
await cliente.query('DROP SCHEMA IF EXISTS leccion3 CASCADE')
await cliente.query('CREATE SCHEMA leccion3')
await cliente.query(`CREATE TABLE leccion3.reservas (
  id serial PRIMARY KEY,
  sala text NOT NULL,
  inicio timestamptz NOT NULL
)`)
await cliente.end()
