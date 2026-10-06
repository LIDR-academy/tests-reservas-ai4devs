export type Sala = { nombre: string; aforoMax: number; abierta: boolean }

export function admiteReserva(sala: Sala, personas: number): { admitida: boolean; motivo?: string } {
  if (!sala.abierta) {
    return { admitida: false, motivo: 'sala cerrada' }
  }
  if (personas > sala.aforoMax) {
    return { admitida: false, motivo: 'supera el aforo' }
  }
  return { admitida: true }
}

export function plazasLibres(sala: Sala, ocupadas: number): number {
  return Math.max(0, sala.aforoMax - ocupadas)
}
