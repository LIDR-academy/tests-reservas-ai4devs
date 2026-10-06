import type { Datos } from './datos.ts'

export type Peticion = { sala: string; desde: string; hasta: string }

export async function reservar(datos: Datos, peticion: Peticion) {
  const { sala, desde, hasta } = peticion

  const cruzan = await datos.reservasQueSeCruzan(sala, desde, hasta)
  if (cruzan.length > 0) {
    return { ok: false, motivo: 'La sala ya está reservada en ese intervalo' }
  }

  await datos.crearReserva(sala, desde, hasta)
  return { ok: true }
}

export async function salasLibres(datos: Datos, desde: string, hasta: string) {
  const salas = await datos.salasLibres(desde, hasta)
  return salas.map((s) => `${s.nombre} (${s.aforo.toLocaleString('es')} plazas)`)
}
