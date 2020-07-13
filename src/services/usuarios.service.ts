import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { REST_SERVER_URL } from './configuration'
import { Usuario } from 'src/domain/usuario'

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(private http: HttpClient) {}

  async usuariosPosibles() {
    return this.http.get<Usuario[]>(REST_SERVER_URL + '/usuarios').toPromise()
  }
}
