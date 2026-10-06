import { pool } from './db.ts'
import { esCancelacionTardia } from './regla.ts'

const { rows } = await pool.query(
  "INSERT INTO reservas (sala, inicio) VALUES ('Nogal', now() + interval '45 minutes') RETURNING inicio"
)
const inicio = rows[0].inicio
const ahora = new Date().toISOString()

console.log('tipo del valor que llega de la base:', inicio.constructor.name)
console.log('esCancelacionTardia(inicio, ahora) =', esCancelacionTardia(inicio, ahora))
console.log('y con el mismo instante pasado a texto:', esCancelacionTardia(inicio.toISOString(), ahora))
await pool.end()
