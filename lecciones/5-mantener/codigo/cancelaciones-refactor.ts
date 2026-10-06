export type Reserva = { sala: string; inicio: Date; importe: number }

export class Cancelaciones {
  cancelar(reserva: Reserva, ahora: Date): { reembolso: number } {
    const horas = (reserva.inicio.getTime() - ahora.getTime()) / 3_600_000
    return { reembolso: horas >= 24 ? reserva.importe : 0 }
  }
}
