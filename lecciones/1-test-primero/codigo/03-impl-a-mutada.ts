export type Reserva = { sala: string; inicio: string; fin: string }
export type Respuesta = { estado: number; cuerpo: Record<string, unknown> }

// Compara strings: válido mientras inicio/fin usen un formato ordenable (ISO 8601, HH:MM)
function solapan(a: Reserva, b: Reserva): boolean {
  return a.sala === b.sala && a.inicio < b.fin && b.inicio <= a.fin
}

export function crearReserva(reservas: Reserva[], nueva: Reserva): Respuesta {
  const conflicto = reservas.find((existente) => solapan(existente, nueva))
  if (conflicto) {
    return { estado: 409, cuerpo: { error: 'La sala ya está reservada en ese horario', conflicto } }
  }
  reservas.push(nueva)
  return { estado: 201, cuerpo: nueva }
}
