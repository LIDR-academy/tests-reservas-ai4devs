import type { Client } from 'pg'

export interface Datos {
  reservasQueSeCruzan(sala: string, desde: string, hasta: string): Promise<{ id: number }[]>
  crearReserva(sala: string, desde: string, hasta: string): Promise<void>
  salasLibres(desde: string, hasta: string): Promise<{ nombre: string; aforo: number }[]>
}

export class DatosPg implements Datos {
  db: Client

  constructor(db: Client) {
    this.db = db
  }

  async reservasQueSeCruzan(sala: string, desde: string, hasta: string) {
    const r = await this.db.query(
      'SELECT id FROM reservas WHERE sala = $1 AND inicio < $3 AND fin > $2',
      [sala, desde, hasta]
    )
    return r.rows
  }

  async crearReserva(sala: string, desde: string, hasta: string) {
    await this.db.query('INSERT INTO reservas (sala, inicio, fin) VALUES ($1, $2, $3)', [
      sala,
      desde,
      hasta,
    ])
  }

  async salasLibres(desde: string, hasta: string) {
    const r = await this.db.query(
      `SELECT nombre, aforo FROM salas s
       WHERE NOT EXISTS (
         SELECT 1 FROM reservas r WHERE r.sala = s.nombre AND r.inicio < $2 AND r.fin > $1
       ) ORDER BY nombre`,
      [desde, hasta]
    )
    return r.rows
  }
}
