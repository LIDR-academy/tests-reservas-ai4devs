import pg from 'pg'

// La conexión a la base de trabajo, siempre dentro del esquema `leccion3` (lo crea ayuda/base.ts).
export const pool = new pg.Pool({
  host: process.env.HOST_TRABAJO,
  port: 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: 'reservas_trabajo',
  options: '-c search_path=leccion3',
})
