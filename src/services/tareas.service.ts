import { Tarea } from "../domain/tarea"
import { Http, Response } from "@angular/http"
import { Injectable } from "@angular/core"
import { map, catchError } from 'rxjs/operators'
import { REST_SERVER_URL } from "./configuration"
import { Observable } from "rxjs"

export interface ITareasService {
  todasLasTareas(): Observable<any>
  getTareaById(id: number) : Observable<Tarea>
  actualizarTarea(tarea: Tarea): void
}

@Injectable({
  providedIn: 'root'
})
export class TareasService implements ITareasService {

  constructor(private http: Http) { }

  todasLasTareas() {
    return this.http.get(REST_SERVER_URL + "/tareas").pipe(
      map(this.convertToTareas)
    )
  }

  getTareaById(id: number) {
    return this.http.get(REST_SERVER_URL + "/tareas/" + id).pipe(map(res => this.tareaAsJson(res.json())))
  }

  actualizarTarea(tarea: Tarea) {
    return this.http.put(REST_SERVER_URL + "/tareas/" + tarea.id, tarea.toJSON())
  }

  private convertToTareas(res: Response) {
    return res.json().map(tareaJson => Tarea.fromJson(tareaJson))
  }

  private tareaAsJson(tareaJSON) : Tarea {
    return Tarea.fromJson(tareaJSON)
  }
}