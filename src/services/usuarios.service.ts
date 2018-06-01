import {Usuario} from "../domain/usuario"
import {Injectable} from "@angular/core"
import {Http, Response} from "@angular/http"
import { map } from 'rxjs/operators'
import { REST_SERVER_URL } from "./configuration"

@Injectable({
  providedIn: 'root'
})
export class UsuariosService{

  constructor(private http: Http){}

  usuariosPosibles() {
    return this.http.get(REST_SERVER_URL + "/usuarios").pipe(map(this.extractData))
  }

  private extractData(res: Response) {
    let body = res.json()
    let usuarios = []
    body.forEach(nombreUsuario => usuarios.push(
      new Usuario(nombreUsuario)
    ))
    return usuarios
  }
  
}