import { test } from '@japa/runner'
import { pool } from '../db.ts'
import { crearServidor } from '../servidor.ts'

test.group('cancelación tardía (contrato)', (group) => {
  const servidor = crearServidor()
  let url = ''

  group.setup(async () => {
    await new Promise<void>((ok) => servidor.listen(0, '127.0.0.1', ok))
    url = `http://127.0.0.1:${(servidor.address() as any).port}`
  })
  group.teardown(async () => {
    servidor.close()
    await pool.end()
  })

  test('quien cancela una reserva que empieza en 45 minutos recibe cancelacionTardia: true', async ({ assert }) => {
    const { rows } = await pool.query(
      "INSERT INTO reservas (sala, inicio) VALUES ('Nogal', now() + interval '45 minutes') RETURNING id"
    )
    const respuesta = await fetch(`${url}/reservas/${rows[0].id}/cancelacion`)
    const cuerpo = await respuesta.json()
    assert.equal(respuesta.status, 200)
    assert.isTrue(cuerpo.cancelacionTardia)
  })
})
