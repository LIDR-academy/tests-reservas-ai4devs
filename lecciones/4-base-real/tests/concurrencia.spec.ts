import { test } from '@japa/runner'
import pg from 'pg'
import { conexion } from '../codigo/config.ts'
import { DatosPg } from '../src/datos.ts'
import { reservar } from '../codigo/reservas.ts'

const pausa = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Simula el trabajo de la aplicación entre "la sala está libre" y "la reservo": 100 ms.
function conLatencia(datos: DatosPg) {
  const crear = datos.crearReserva.bind(datos)
  datos.crearReserva = async (...args) => {
    await pausa(100)
    return crear(...args)
  }
  return datos
}

test('dos peticiones simultáneas a la misma sala', async ({ assert }) => {
  const a = new pg.Client(conexion)
  const b = new pg.Client(conexion)
  await Promise.all([a.connect(), b.connect()])
  await a.query('TRUNCATE reservas RESTART IDENTITY')

  const primera = { sala: 'Nogal', desde: '2026-10-06T10:00:00Z', hasta: '2026-10-06T11:00:00Z' }
  const segunda = { sala: 'Nogal', desde: '2026-10-06T10:30:00Z', hasta: '2026-10-06T11:30:00Z' }
  const resultados = await Promise.allSettled([
    reservar(conLatencia(new DatosPg(a)), primera),
    pausa(20).then(() => reservar(conLatencia(new DatosPg(b)), segunda)),
  ])
  for (const r of resultados) {
    console.log(r.status === 'fulfilled' ? r.value : `rechazada: ${r.reason.message}`)
  }

  const { rows } = await a.query('SELECT id FROM reservas')
  await Promise.all([a.end(), b.end()])
  assert.lengthOf(rows, 1)
})
