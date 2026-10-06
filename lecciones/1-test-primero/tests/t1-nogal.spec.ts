import { test } from '@japa/runner'
import { crearReserva, type Reserva } from '../src/reservas.ts'

test.group('reservas de salas', () => {
  test('rechaza una reserva que se solapa con otra de la misma sala', ({ assert }) => {
    const reservas: Reserva[] = [{ sala: 'Nogal', inicio: '10:30', fin: '11:30' }]

    const respuesta = crearReserva(reservas, { sala: 'Nogal', inicio: '10:00', fin: '11:00' })

    assert.equal(respuesta.estado, 409)
    assert.lengthOf(reservas, 1)
  })
})
