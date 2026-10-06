import pg from 'pg'
import { conexion } from './config.ts'

// Abre su propia conexión, como haría un informe o un proceso hermano.
export async function reservasDeLaSala(sala: string) {
  const db = new pg.Client(conexion)
  await db.connect()
  const r = await db.query('SELECT id FROM reservas WHERE sala = $1', [sala])
  await db.end()
  return r.rows
}
