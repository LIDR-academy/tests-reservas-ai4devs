import { test } from '@japa/runner'
import { pool } from '../db.ts'
import { crearServidor } from '../servidor.ts'

// El único test de contrato de la sección sobre el diagnóstico: la reserva empieza dentro de
// una hora y media y la respuesta debe decir «tardía». Con SIN_TOKEN=1 la petición va sin sesión.
test.group('cancelación tardía (contrato)', (group) => {
  const servidor = crearServidor({ token: 'sesion-de-ada' })
  let url = ''

  group.setup(async () => {
    await new Promise<void>((ok) => servidor.listen(0, '127.0.0.1', ok))
    url = `http://127.0.0.1:${(servidor.address() as any).port}`
  })
  group.teardown(async () => {
    servidor.close()
    await pool.end()
  })

  test('una hora y media es tardía', async ({ assert }) => {
    const { rows } = await pool.query(
      "INSERT INTO reservas (sala, inicio) VALUES ('Nogal', now() + interval '90 minutes') RETURNING id"
    )
    const respuesta = await fetch(`${url}/reservas/${rows[0].id}/cancelacion`, {
      headers: { authorization: process.env.SIN_TOKEN ? '' : 'Bearer sesion-de-ada' },
    })
    const cuerpo = await respuesta.json().catch(() => ({}))
    assert.equal(respuesta.status, 200)
    assert.isTrue(cuerpo.cancelacionTardia)
  })
})
