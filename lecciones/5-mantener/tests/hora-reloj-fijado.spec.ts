import { test } from '@japa/runner'
import { estaAbierta } from '../src/horario.ts'

test('a las 10:00 la sala Nogal está abierta', ({ assert }) => {
  assert.isTrue(estaAbierta(new Date(2026, 9, 5, 10, 0)))
})

test('a las 22:00 la sala Nogal está cerrada', ({ assert }) => {
  assert.isFalse(estaAbierta(new Date(2026, 9, 5, 22, 0)))
})
