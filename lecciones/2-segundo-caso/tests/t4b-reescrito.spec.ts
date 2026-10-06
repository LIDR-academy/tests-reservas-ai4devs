import { test } from '@japa/runner'
import { reservar } from '../src/reservas.ts'

test.group('aforo', () => {
  const nogal = { nombre: 'Nogal', plazas: 6 }
  const roble = { nombre: 'Roble', plazas: 12 }

  test('Nogal rechaza nueve', ({ assert }) => {
    assert.isFalse(reservar(nogal, 9).aceptada)
  })

  test('Roble acepta nueve', ({ assert }) => {
    assert.isTrue(reservar(roble, 9).aceptada)
  })

  test('Nogal acepta cinco, justo por debajo de su aforo', ({ assert }) => {
    assert.isTrue(reservar(nogal, 5).aceptada)
  })

  test('Nogal rechaza siete, una más que su aforo', ({ assert }) => {
    assert.isFalse(reservar(nogal, 7).aceptada)
  })
})
