// Una sala se reserva de 08:00 a 20:00 (hora local del servidor).
export function estaAbierta(ahora: Date = new Date()): boolean {
  const hora = ahora.getHours()
  return hora >= 8 && hora < 20
}
