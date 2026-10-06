export type Reserva = { sala: string; inicio: string; fin: string }
export type Respuesta = { estado: number; cuerpo: Record<string, unknown> }

export function crearReserva(reservas: Reserva[], nueva: Reserva): Respuesta {
  const haySolape = reservas.some(
    (r) => r.sala === nueva.sala && nueva.inicio < r.fin && r.inicio < nueva.fin
  )
  if (haySolape) {
    return { estado: 409, cuerpo: { error: 'La sala ya está reservada en ese horario' } }
  }

  reservas.push(nueva)
  return { estado: 201, cuerpo: nueva }
}
