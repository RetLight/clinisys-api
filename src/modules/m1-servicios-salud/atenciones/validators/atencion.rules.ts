export class AtencionRules {
  /**
   * Valida que la fecha de atención no sea anterior a la fecha de la cita.
   */
  static fechaNoAntesDeCita(fechaCita: Date, fechaAtencion: Date): boolean {
    return fechaAtencion.getTime() >= fechaCita.getTime();
  }
}
