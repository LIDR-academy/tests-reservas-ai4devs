import { test } from '@japa/runner'
import { admiteReserva, plazasLibres, type Sala } from '../src/aforo.ts'

const salaAbierta: Sala = { nombre: 'Principal', aforoMax: 50, abierta: true }
const salaCerrada: Sala = { nombre: 'Taller', aforoMax: 20, abierta: false }

test.group('admiteReserva', () => {
  test('rechaza la reserva si la sala está cerrada', ({ assert }) => {
    assert.deepEqual(admiteReserva(salaCerrada, 5), { admitida: false, motivo: 'sala cerrada' })
  })

  test('rechaza por sala cerrada aunque las personas superen el aforo', ({ assert }) => {
    assert.deepEqual(admiteReserva(salaCerrada, 100), { admitida: false, motivo: 'sala cerrada' })
  })

  test('rechaza la reserva si supera el aforo', ({ assert }) => {
    assert.deepEqual(admiteReserva(salaAbierta, 51), { admitida: false, motivo: 'supera el aforo' })
  })

  test('admite la reserva cuando las personas igualan el aforo', ({ assert }) => {
    assert.deepEqual(admiteReserva(salaAbierta, 50), { admitida: true })
  })

  test('admite la reserva cuando las personas están por debajo del aforo', ({ assert }) => {
    const resultado = admiteReserva(salaAbierta, 10)
    assert.isTrue(resultado.admitida)
    assert.isUndefined(resultado.motivo)
  })
})

test.group('plazasLibres', () => {
  test('devuelve la diferencia entre aforo y ocupadas', ({ assert }) => {
    assert.equal(plazasLibres(salaAbierta, 20), 30)
  })

  test('devuelve el aforo completo si no hay ocupadas', ({ assert }) => {
    assert.equal(plazasLibres(salaAbierta, 0), 50)
  })

  test('devuelve cero cuando la sala está llena', ({ assert }) => {
    assert.equal(plazasLibres(salaAbierta, 50), 0)
  })

  test('nunca devuelve un valor negativo si hay sobreocupación', ({ assert }) => {
    assert.equal(plazasLibres(salaAbierta, 80), 0)
  })
})
