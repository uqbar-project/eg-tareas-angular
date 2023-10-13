import { Injectable } from '@angular/core'
import { Usuario } from 'src/domain/usuario'
import { UsuariosService } from './usuarios.service'

export const juana = new Usuario('Juana Molina')

@Injectable()
export class UsuariosMockService implements UsuariosService {
  async usuariosPosibles() {
    return [juana, new Usuario('John Doe')]
  }
}
