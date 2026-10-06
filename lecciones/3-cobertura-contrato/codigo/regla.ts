const DOS_HORAS = 2 * 60 * 60 * 1000

export function esCancelacionTardia(horaReserva: string, ahora: string): boolean {
  const limite = new Date(Date.parse(ahora) + DOS_HORAS).toISOString()
  return horaReserva < limite
}
