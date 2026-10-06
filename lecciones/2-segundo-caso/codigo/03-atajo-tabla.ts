export type Sala = { nombre: string; plazas: number }
export type Resultado = { aceptada: boolean; motivo?: string }

function rechazar(motivo: string): Resultado {
  return { aceptada: false, motivo }
}

const AFORO: Record<string, number> = { Nogal: 6, Roble: 12 }

function aforoDe(sala: Sala): number {
  return AFORO[sala.nombre] ?? 12
}

export function reservar(sala: Sala, asistentes: number): Resultado {
  if (asistentes > aforoDe(sala)) {
    return rechazar('aforo superado')
  }
  return { aceptada: true }
}
