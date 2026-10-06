import { test } from '@japa/runner'
import { reembolso } from '../src/cancelar.ts'

test('con 48 horas de margen se devuelve todo', ({ assert }) => {
  assert.equal(reembolso(80, 48), 80)
})

test('con 24 horas justas se devuelve todo', ({ assert }) => {
  assert.equal(reembolso(80, 24), 80)
})

test('con menos de 24 horas no se devuelve nada', ({ assert }) => {
  assert.equal(reembolso(80, 23), 0)
})
