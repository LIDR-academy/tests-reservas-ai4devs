import pg from 'pg'
import { conexion } from './config.ts'

const db = new pg.Client(conexion)
const otra = new pg.Client(conexion)
await db.connect()
await otra.connect()

db.on('notice', (n) => console.log(`   aviso del motor: ${n.message}`))

const reservasVistas = async (cliente: pg.Client) =>
  (await cliente.query('SELECT count(*)::int AS n FROM reservas')).rows[0].n
const reservar = (cliente: pg.Client, inicio: string, fin: string) =>
  cliente.query(`INSERT INTO reservas (sala, inicio, fin) VALUES ('Nogal', $1, $2)`, [inicio, fin])
const limpiar = () => otra.query('TRUNCATE reservas RESTART IDENTITY')

await limpiar()

console.log('1. BEGIN y COMMIT escritos a mano dentro de la transacción del test')
await db.query('BEGIN') // la transacción del test
await reservar(db, '2026-10-06T10:00:00Z', '2026-10-06T11:00:00Z') // lo que siembra el test
await db.query('BEGIN') // la transacción propia del código
await reservar(db, '2026-10-06T12:00:00Z', '2026-10-06T13:00:00Z')
await db.query('COMMIT') // el código confirma la suya
await db.query('ROLLBACK') // el test deshace al terminar
console.log('   reservas que ve otra conexión después del ROLLBACK del test:', await reservasVistas(otra))

await limpiar()

console.log('2. La transacción propia con un punto de guardado, y el código la confirma')
await db.query('BEGIN')
await reservar(db, '2026-10-06T10:00:00Z', '2026-10-06T11:00:00Z')
await db.query('SAVEPOINT propia')
await reservar(db, '2026-10-06T12:00:00Z', '2026-10-06T13:00:00Z')
await db.query('RELEASE SAVEPOINT propia') // «commit» de la propia
console.log('   dentro del test, tras confirmar la propia:', await reservasVistas(db))
await db.query('ROLLBACK')
console.log('   después del ROLLBACK del test:', await reservasVistas(otra))

console.log('3. La transacción propia con un punto de guardado, y el código la deshace')
await db.query('BEGIN')
await reservar(db, '2026-10-06T10:00:00Z', '2026-10-06T11:00:00Z')
await db.query('SAVEPOINT propia')
await reservar(db, '2026-10-06T12:00:00Z', '2026-10-06T13:00:00Z')
await db.query('ROLLBACK TO SAVEPOINT propia') // «rollback» de la propia
console.log('   dentro del test, tras deshacer la propia:', await reservasVistas(db))
await db.query('ROLLBACK')
console.log('   después del ROLLBACK del test:', await reservasVistas(otra))

await limpiar()
await Promise.all([db.end(), otra.end()])
