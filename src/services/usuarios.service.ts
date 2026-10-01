import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Usuario } from 'domain/usuario'
import { lastValueFrom } from 'rxjs'
import { REST_SERVER_URL } from './configuration'

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  constructor(private http: HttpClient) {}

  async usuariosPosibles() {
    const usuarios$ = this.http.get<Usuario[]>(REST_SERVER_URL + '/usuarios')
    return lastValueFrom(usuarios$)
  }
}
