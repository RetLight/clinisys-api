import { Usuario } from '../entities/usuario.entity';

export interface UsuarioRepository {
  findByEmail(email: string): Promise<Usuario | null>;
  findById(id: string): Promise<Usuario | null>;
  save(usuario: Usuario): Promise<void>;
}
