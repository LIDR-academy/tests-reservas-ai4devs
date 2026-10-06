import { test } from '@japa/runner'
import { mock } from 'node:test'
import { Cancelaciones } from '../src/cancelaciones.ts'

const reserva = { sala: 'Nogal', inicio: new Date('2026-10-10T10:00:00Z'), importe: 80 }

test('cancelar consulta las horas que faltan con horasHasta', ({ assert }) => {
  const cancelaciones = new Cancelaciones()
  const espia = mock.method(cancelaciones, 'horasHasta')

  cancelaciones.cancelar(reserva, new Date('2026-10-09T04:00:00Z'))

  assert.equal(espia.mock.callCount(), 1)
})

test('cancelar con 30 horas de margen devuelve todo el importe', ({ assert }) => {
  const resultado = new Cancelaciones().cancelar(reserva, new Date('2026-10-09T04:00:00Z'))

  assert.deepEqual(resultado, { reembolso: 80 })
})

test('cancelar con 2 horas de margen no devuelve nada', ({ assert }) => {
  const resultado = new Cancelaciones().cancelar(reserva, new Date('2026-10-10T08:00:00Z'))

  assert.deepEqual(resultado, { reembolso: 0 })
})
