export type Reserva = { sala: string; inicio: Date; importe: number }

export class Cancelaciones {
  horasHasta(inicio: Date, ahora: Date): number {
    return (ahora.getTime() - inicio.getTime()) / 3_600_000
  }

  cancelar(reserva: Reserva, ahora: Date): { reembolso: number } {
    const horas = this.horasHasta(reserva.inicio, ahora)
    return { reembolso: horas >= 24 ? reserva.importe : 0 }
  }
}
