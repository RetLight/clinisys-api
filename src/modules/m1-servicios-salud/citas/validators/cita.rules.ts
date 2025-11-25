export class CitaRules {
  /** horario 08:00 a 20:00 */
  static horaValida(date: Date): boolean {
    const h = date.getHours();
    return h >= 8 && h <= 20;
  }
}
