// La regla corregida, con el umbral mal escrito: 30 minutos en lugar de dos horas.
const DOS_HORAS = 30 * 60 * 1000

export function esCancelacionTardia(horaReserva: string | Date, ahora: string): boolean {
  return new Date(horaReserva).getTime() < Date.parse(ahora) + DOS_HORAS
}
