import { test } from '@japa/runner'
import { admiteReserva, plazasLibres } from '../src/aforo.ts'

const nogal = { nombre: 'Nogal', aforoMax: 12, abierta: true }

test('admiteReserva con la sala cerrada', ({ assert }) => {
  const resultado = admiteReserva({ ...nogal, abierta: false }, 4)
  assert.isDefined(resultado)
})

test('admiteReserva con más personas que el aforo', ({ assert }) => {
  const resultado = admiteReserva(nogal, 20)
  assert.isDefined(resultado)
})

test('admiteReserva con una reserva normal', ({ assert }) => {
  const resultado = admiteReserva(nogal, 4)
  assert.isDefined(resultado)
})

test('plazasLibres devuelve un número', ({ assert }) => {
  const resultado = plazasLibres(nogal, 5)
  assert.isNumber(resultado)
})
