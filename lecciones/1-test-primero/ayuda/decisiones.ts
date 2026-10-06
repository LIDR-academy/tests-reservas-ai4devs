import { crearReserva, type Reserva } from '../src/reservas.ts'

const nogal = (): Reserva[] => [{ sala: 'Nogal', inicio: '10:30', fin: '11:30' }]

console.log('1. Nogal 10:00-11:00 con 10:30-11:30 ya reservada')
console.log(JSON.stringify(crearReserva(nogal(), { sala: 'Nogal', inicio: '10:00', fin: '11:00' })))

console.log('2. Nogal 11:30-12:30, que empieza justo cuando la otra acaba')
console.log(JSON.stringify(crearReserva(nogal(), { sala: 'Nogal', inicio: '11:30', fin: '12:30' })))

console.log('3. lo que la respuesta cuenta de la otra reserva')
const r = crearReserva(nogal(), { sala: 'Nogal', inicio: '10:00', fin: '11:00' })
console.log(Object.keys(r.cuerpo).join(', '))
