import { test } from '@japa/runner'
import { crearReserva, type Reserva } from '../src/reservas.ts'

const base: Reserva = { sala: 'A', inicio: '2026-10-05T10:00', fin: '2026-10-05T12:00' }

test.group('crearReserva', () => {
  test('crea la reserva si no hay ninguna previa', ({ assert }) => {
    const reservas: Reserva[] = []
    const res = crearReserva(reservas, base)
    assert.equal(res.estado, 201)
    assert.deepEqual(res.cuerpo, base)
    assert.deepEqual(reservas, [base])
  })

  test('rechaza una reserva idéntica', ({ assert }) => {
    const reservas = [base]
    const res = crearReserva(reservas, { ...base })
    assert.equal(res.estado, 409)
    assert.lengthOf(reservas, 1)
  })

  test('rechaza si empieza dentro de una reserva existente', ({ assert }) => {
    const reservas = [base]
    const res = crearReserva(reservas, { sala: 'A', inicio: '2026-10-05T11:00', fin: '2026-10-05T13:00' })
    assert.equal(res.estado, 409)
    assert.deepEqual(res.cuerpo.conflicto, base)
    assert.lengthOf(reservas, 1)
  })

  test('rechaza si termina dentro de una reserva existente', ({ assert }) => {
    const reservas = [base]
    const res = crearReserva(reservas, { sala: 'A', inicio: '2026-10-05T09:00', fin: '2026-10-05T10:30' })
    assert.equal(res.estado, 409)
    assert.lengthOf(reservas, 1)
  })

  test('rechaza si envuelve por completo una reserva existente', ({ assert }) => {
    const reservas = [base]
    const res = crearReserva(reservas, { sala: 'A', inicio: '2026-10-05T09:00', fin: '2026-10-05T13:00' })
    assert.equal(res.estado, 409)
    assert.lengthOf(reservas, 1)
  })

  test('rechaza si queda contenida en una reserva existente', ({ assert }) => {
    const reservas = [base]
    const res = crearReserva(reservas, { sala: 'A', inicio: '2026-10-05T10:30', fin: '2026-10-05T11:30' })
    assert.equal(res.estado, 409)
    assert.lengthOf(reservas, 1)
  })

  test('permite reservas consecutivas (fin == inicio)', ({ assert }) => {
    const reservas = [base]
    const despues = crearReserva(reservas, { sala: 'A', inicio: '2026-10-05T12:00', fin: '2026-10-05T13:00' })
    const antes = crearReserva(reservas, { sala: 'A', inicio: '2026-10-05T09:00', fin: '2026-10-05T10:00' })
    assert.equal(despues.estado, 201)
    assert.equal(antes.estado, 201)
    assert.lengthOf(reservas, 3)
  })

  test('permite el mismo horario en otra sala', ({ assert }) => {
    const reservas = [base]
    const res = crearReserva(reservas, { ...base, sala: 'B' })
    assert.equal(res.estado, 201)
    assert.lengthOf(reservas, 2)
  })

  test('detecta el solape con cualquiera de varias reservas existentes', ({ assert }) => {
    const reservas: Reserva[] = [
      { sala: 'A', inicio: '2026-10-05T08:00', fin: '2026-10-05T09:00' },
      base,
      { sala: 'B', inicio: '2026-10-05T14:00', fin: '2026-10-05T15:00' },
    ]
    const res = crearReserva(reservas, { sala: 'A', inicio: '2026-10-05T11:59', fin: '2026-10-05T12:30' })
    assert.equal(res.estado, 409)
    assert.deepEqual(res.cuerpo.conflicto, base)
    assert.lengthOf(reservas, 3)
  })
})
