import { test } from '@japa/runner'
import pg from 'pg'
import { conexion } from '../codigo/config.ts'
import { DatosPg } from '../src/datos.ts'
import { reservar } from '../codigo/reservas.ts'

test.group('solapamiento contra PostgreSQL de verdad', (group) => {
  const db = new pg.Client(conexion)

  group.setup(() => db.connect())
  group.teardown(() => db.end())
  group.each.setup(() => db.query('BEGIN'))
  group.each.teardown(() => db.query('ROLLBACK'))

  test('rechaza una reserva que se solapa', async ({ assert }) => {
    await db.query(`INSERT INTO salas (nombre) VALUES ('Nogal')`)
    await db.query(
      `INSERT INTO reservas (sala, inicio, fin)
       VALUES ('Nogal', '2026-10-06T10:30:00Z', '2026-10-06T11:30:00Z')`
    )

    const r = await reservar(new DatosPg(db), {
      sala: 'Nogal',
      desde: '2026-10-06T10:00:00Z',
      hasta: '2026-10-06T11:00:00Z',
    })

    assert.isFalse(r.ok)
  })
})
