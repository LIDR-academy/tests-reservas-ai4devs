import { test } from '@japa/runner'
import { estaAbierta } from '../src/horario.ts'

test('la sala Nogal está abierta en horario de oficina', ({ assert }) => {
  assert.isTrue(estaAbierta())
})
