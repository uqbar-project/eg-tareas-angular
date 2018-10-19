import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { REST_SERVER_URL } from "./configuration";

@Injectable({
  providedIn: 'root'
})
export class UsuariosService{

  constructor(private http: Http){}

  async usuariosPosibles() {
    return this.http.get(REST_SERVER_URL + "/usuarios").toPromise()
  }

}