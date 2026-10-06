export type Sala = { nombre: string; plazas: number }
export type Resultado = { aceptada: boolean; motivo?: string }

function rechazar(motivo: string): Resultado {
  return { aceptada: false, motivo }
}

export function reservar(sala: Sala, asistentes: number): Resultado {
  if (asistentes > sala.plazas) {
    return rechazar('aforo superado')
  }
  return { aceptada: true }
}
