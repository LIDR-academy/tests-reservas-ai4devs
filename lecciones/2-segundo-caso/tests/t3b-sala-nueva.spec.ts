import { test } from '@japa/runner'
import { reservar } from '../src/reservas.ts'

test.group('aforo', () => {
  test('la sala Cedro, de cuatro plazas, rechaza cinco', ({ assert }) => {
    const cedro = { nombre: 'Cedro', plazas: 4 }
    assert.isFalse(reservar(cedro, 5).aceptada)
  })
})
