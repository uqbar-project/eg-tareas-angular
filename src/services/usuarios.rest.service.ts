import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { REST_SERVER_URL } from './configuration'
import { Usuario } from 'src/domain/usuario'
import { lastValueFrom } from 'rxjs'
import { UsuariosService } from './usuarios.service'


@Injectable()
export class UsuariosRestService implements UsuariosService {

  constructor(private http: HttpClient) { }

  async usuariosPosibles() {
    const usuarios$ = this.http.get<Usuario[]>(REST_SERVER_URL + '/usuarios')
    return lastValueFrom(usuarios$)
  }

}
