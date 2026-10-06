export function reembolso(importe: number, horasDeMargen: number): number {
  return horasDeMargen > 24 ? importe : 0
}
