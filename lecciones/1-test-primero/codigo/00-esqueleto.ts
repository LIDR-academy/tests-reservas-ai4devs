export type Reserva = { sala: string; inicio: string; fin: string }
export type Respuesta = { estado: number; cuerpo: Record<string, unknown> }

// Esqueleto: la función existe pero acepta todas las reservas.
export function crearReserva(reservas: Reserva[], nueva: Reserva): Respuesta {
  reservas.push(nueva)
  return { estado: 201, cuerpo: nueva }
}
