import { test } from '@japa/runner'
import { esCancelacionTardia } from '../regla.ts'

test.group('cancelación tardía (regla sola)', () => {
  const ahora = '2026-10-05T10:00:00.000Z'

  test('dos horas justas no es tardía', ({ assert }) => {
    assert.isFalse(esCancelacionTardia('2026-10-05T12:00:00.000Z', ahora))
  })
  test('una hora y media es tardía', ({ assert }) => {
    assert.isTrue(esCancelacionTardia('2026-10-05T11:30:00.000Z', ahora))
  })
  test('tres horas no es tardía', ({ assert }) => {
    assert.isFalse(esCancelacionTardia('2026-10-05T13:00:00.000Z', ahora))
  })
  test('el minuto anterior a las dos horas es tardía', ({ assert }) => {
    assert.isTrue(esCancelacionTardia('2026-10-05T11:59:00.000Z', ahora))
  })
  test('el minuto posterior a las dos horas no es tardía', ({ assert }) => {
    assert.isFalse(esCancelacionTardia('2026-10-05T12:01:00.000Z', ahora))
  })
  test('diez minutos es tardía', ({ assert }) => {
    assert.isTrue(esCancelacionTardia('2026-10-05T10:10:00.000Z', ahora))
  })
  test('el cambio de día, con 45 minutos, es tardía', ({ assert }) => {
    assert.isTrue(esCancelacionTardia('2026-10-06T00:15:00.000Z', '2026-10-05T23:30:00.000Z'))
  })
  test('el cambio de día, con dos horas y media, no es tardía', ({ assert }) => {
    assert.isFalse(esCancelacionTardia('2026-10-06T02:00:00.000Z', '2026-10-05T23:30:00.000Z'))
  })
})
