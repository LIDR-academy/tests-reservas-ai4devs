import { test } from '@japa/runner'
import { reembolso } from '../src/cancelar.ts'

test.group('reembolso', () => {
  test('devuelve el importe completo si quedan más de 24 horas de margen', ({ assert }) => {
    assert.equal(reembolso(100, 48), 100)
  })

  test('devuelve el importe completo con un margen apenas superior a 24 horas', ({ assert }) => {
    assert.equal(reembolso(100, 24.01), 100)
    assert.equal(reembolso(100, 25), 100)
  })

  test('devuelve 0 si el margen es exactamente de 24 horas', ({ assert }) => {
    assert.equal(reembolso(100, 24), 0)
  })

  test('devuelve 0 si el margen es inferior a 24 horas', ({ assert }) => {
    assert.equal(reembolso(100, 23), 0)
    assert.equal(reembolso(100, 23.99), 0)
  })

  test('devuelve 0 si no queda margen', ({ assert }) => {
    assert.equal(reembolso(100, 0), 0)
  })

  test('devuelve 0 si el margen es negativo', ({ assert }) => {
    assert.equal(reembolso(100, -5), 0)
  })

  test('conserva importes decimales cuando corresponde reembolso', ({ assert }) => {
    assert.equal(reembolso(49.99, 72), 49.99)
  })

  test('devuelve 0 cuando el importe es 0, aunque haya margen', ({ assert }) => {
    assert.equal(reembolso(0, 72), 0)
  })

  test('devuelve el importe tal cual si es negativo y hay margen suficiente', ({ assert }) => {
    assert.equal(reembolso(-10, 72), -10)
  })
})
