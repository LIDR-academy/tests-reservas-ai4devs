import { test } from '@japa/runner'
import pg from 'pg'
import { conexion } from '../codigo/config.ts'
import { DatosPg } from '../src/datos.ts'
import { salasLibres } from '../codigo/reservas.ts'

// El juego de datos común: todas las salas, con su aforo.
async function sembrarJuegoComun(db: pg.Client) {
  await db.query(`INSERT INTO salas (nombre, aforo) VALUES ('Nogal', NULL), ('Cedro', 6), ('Arce', 20)`)
}

test.group('qué salas están libres', (group) => {
  const db = new pg.Client(conexion)

  group.setup(() => db.connect())
  group.teardown(() => db.end())
  group.each.setup(() => db.query('BEGIN'))
  group.each.teardown(() => db.query('ROLLBACK'))

  test('con el juego de datos común', async ({ assert }) => {
    await sembrarJuegoComun(db)
    await db.query(
      `INSERT INTO reservas (sala, inicio, fin)
       VALUES ('Nogal', '2026-10-06T10:30:00Z', '2026-10-06T11:30:00Z')`
    )

    const libres = await salasLibres(new DatosPg(db), '2026-10-06T10:00:00Z', '2026-10-06T11:00:00Z')

    assert.deepEqual(libres, ['Arce (20 plazas)', 'Cedro (6 plazas)'])
  })

  test('con los datos mínimos: una sala sin reservas', async ({ assert }) => {
    await db.query(`INSERT INTO salas (nombre) VALUES ('Nogal')`)

    const libres = await salasLibres(new DatosPg(db), '2026-10-06T10:00:00Z', '2026-10-06T11:00:00Z')

    assert.lengthOf(libres, 1)
  })
})
