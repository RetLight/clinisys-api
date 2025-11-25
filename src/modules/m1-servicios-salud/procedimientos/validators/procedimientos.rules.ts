export class ProcedimientosRules {
  static validarStockDisponible(
    stockActual: number,
    cantidad: number,
  ): boolean {
    return stockActual >= cantidad;
  }
}
