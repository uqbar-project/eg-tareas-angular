import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { REST_SERVER_URL } from './configuration'
import { Usuario } from 'domain/usuario'
import { lastValueFrom } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  async usuariosPosibles() {
    const usuarios$ = this.http.get<Usuario[]>(REST_SERVER_URL + '/usuarios')
    return lastValueFrom(usuarios$)
  }

}
