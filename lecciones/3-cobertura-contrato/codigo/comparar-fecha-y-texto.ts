// Un objeto Date frente a un texto con forma de fecha: la comparación no falla, da false.
const objeto = new Date('2026-10-05T10:45:00.000Z')
const texto = '2026-10-05T12:00:00.000Z'

console.log('texto contra texto, <:', objeto.toISOString() < texto)
console.log('objeto contra texto, <:', (objeto as any) < texto)
console.log('objeto contra texto, >:', (objeto as any) > texto)
console.log('el texto, convertido a número:', Number(texto))
