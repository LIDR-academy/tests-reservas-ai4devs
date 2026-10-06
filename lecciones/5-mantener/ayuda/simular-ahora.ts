// Fija el reloj del proceso: AHORA=2026-10-05T10:00:00 (hora local). Solo para la demostración.
import { mock } from 'node:test'

if (process.env.AHORA) {
  mock.timers.enable({ apis: ['Date'], now: new Date(process.env.AHORA) })
}
