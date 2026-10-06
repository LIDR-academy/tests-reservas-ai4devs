import http from 'node:http'
import { pool } from './db.ts'
import { esCancelacionTardia } from './regla.ts'

// Un servidor mínimo de Node.js: GET /reservas/<id>/cancelacion lee la reserva de la base y llama a la regla.
// Si se le pasa un token, exige la cabecera «Authorization: Bearer <token>» y responde 401 sin ella
// (es el permiso que rechaza la petición antes de llegar a la regla).
export function crearServidor(opciones: { token?: string } = {}) {
  return http.createServer(async (req, res) => {
    const m = req.url?.match(/^\/reservas\/(\d+)\/cancelacion$/)
    if (!m) {
      res.writeHead(404).end()
      return
    }
    if (opciones.token && req.headers.authorization !== `Bearer ${opciones.token}`) {
      res.writeHead(401).end()
      return
    }
    const { rows } = await pool.query('SELECT id, sala, inicio FROM reservas WHERE id = $1', [m[1]])
    const reserva = rows[0]
    if (!reserva) {
      res.writeHead(404).end()
      return
    }
    const cancelacionTardia = esCancelacionTardia(reserva.inicio, new Date().toISOString())
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ id: reserva.id, sala: reserva.sala, cancelacionTardia }))
  })
}
