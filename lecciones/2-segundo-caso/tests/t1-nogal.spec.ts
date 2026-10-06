import { test } from '@japa/runner'
import { reservar } from '../src/reservas.ts'

test.group('aforo', () => {
  test('la sala Nogal rechaza una reserva para nueve', ({ assert }) => {
    const nogal = { nombre: 'Nogal', plazas: 6 }
    assert.isFalse(reservar(nogal, 9).aceptada)
  })
})
