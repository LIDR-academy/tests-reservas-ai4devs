const DOS_HORAS = 2 * 60 * 60 * 1000

export function esCancelacionTardia(horaReserva: string | Date, ahora: string): boolean {
  return new Date(horaReserva).getTime() < Date.parse(ahora) + DOS_HORAS
}
