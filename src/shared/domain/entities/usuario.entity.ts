export class Usuario {
  constructor(
    public readonly id: string,
    public nombre: string,
    public email: string,
    public passwordHash: string,
    public activo: boolean,
  ) {}
}
