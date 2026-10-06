import { test } from '@japa/runner'
import pg from 'pg'
import { conexion } from '../codigo/config.ts'
import { reservasDeLaSala } from '../codigo/informe.ts'

test.group('transacción por test', (group) => {
  const db = new pg.Client(conexion)

  group.setup(() => db.connect())
  group.teardown(() => db.end())
  group.each.setup(() => db.query('BEGIN'))
  group.each.teardown(() => db.query('ROLLBACK'))

  test('el informe de la sala Nogal lista la reserva sembrada', async ({ assert }) => {
    await db.query(
      `INSERT INTO reservas (sala, inicio, fin)
       VALUES ('Nogal', '2026-10-06T10:30:00Z', '2026-10-06T11:30:00Z')`
    )

    const lista = await reservasDeLaSala('Nogal')

    assert.lengthOf(lista, 1)
  })
})
