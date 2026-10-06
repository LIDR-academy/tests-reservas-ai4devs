import { test } from '@japa/runner'
import { reservar } from '../codigo/reservas.ts'

test('rechaza una reserva que se solapa (con imitación)', async ({ assert }) => {
  const datos = {
    reservasQueSeCruzan: async () => [{ id: 1 }],
    crearReserva: async () => {},
    salasLibres: async () => [],
  }

  const r = await reservar(datos, {
    sala: 'Nogal',
    desde: '2026-10-06T10:00:00Z',
    hasta: '2026-10-06T11:00:00Z',
  })

  assert.isFalse(r.ok)
})
