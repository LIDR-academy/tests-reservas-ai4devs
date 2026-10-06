import { test } from '@japa/runner'
import { reservar } from '../src/reservas.ts'

test.group('aforo', () => {
  test('la sala Nogal rechaza una reserva para nueve', ({ assert }) => {
    const nogal = { nombre: 'Nogal', plazas: 6 }
    assert.isFalse(reservar(nogal, 9).aceptada)
  })

  test('la sala Roble acepta una reserva para nueve', ({ assert }) => {
    const roble = { nombre: 'Roble', plazas: 12 }
    assert.isTrue(reservar(roble, 9).aceptada)
  })
})
