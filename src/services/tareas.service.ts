import { Injectable } from "@angular/core"
import { Http } from "@angular/http"
import { Tarea } from "../domain/tarea"
import { REST_SERVER_URL } from "./configuration"

export interface ITareasService {
  todasLasTareas(): Promise<any>
  getTareaById(id: number) : Promise<Tarea>
  actualizarTarea(tarea: Tarea): void
}

@Injectable({
  providedIn: 'root'
})
export class TareasService implements ITareasService {

  constructor(private http: Http) { }

  async todasLasTareas() {
    const res = await this.http.get(REST_SERVER_URL + "/tareas").toPromise()
    return res.json().map(Tarea.fromJson)
  }

  async getTareaById(id: number) {
    const res = await this.http.get(REST_SERVER_URL + "/tareas/" + id).toPromise()
    return Tarea.fromJson(res.json())
  }

  async actualizarTarea(tarea: Tarea) {
    return this.http.put(REST_SERVER_URL + "/tareas/" + tarea.id, tarea.toJSON()).toPromise()
  }

}