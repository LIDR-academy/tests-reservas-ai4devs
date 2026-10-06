import { test } from '@japa/runner'
import { admiteReserva } from '../src/aforo.ts'

const nogal = { nombre: 'Nogal', aforoMax: 12, abierta: true }

test('una sala cerrada no admite reservas', ({ assert }) => {
  assert.deepEqual(admiteReserva({ ...nogal, abierta: false }, 4), {
    admitida: false,
    motivo: 'sala cerrada',
  })
})

test('una reserva por encima del aforo se rechaza', ({ assert }) => {
  assert.deepEqual(admiteReserva(nogal, 13), { admitida: false, motivo: 'supera el aforo' })
})

test('una reserva que llena justo el aforo se admite', ({ assert }) => {
  assert.deepEqual(admiteReserva(nogal, 12), { admitida: true })
})
