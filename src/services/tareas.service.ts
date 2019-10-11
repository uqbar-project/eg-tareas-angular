import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Tarea } from '../domain/tarea'
import { REST_SERVER_URL } from './configuration'

export interface ITareasService {
  todasLasTareas(): Promise<Tarea[]>
  getTareaById(id: number): Promise<Tarea>
  actualizarTarea(tarea: Tarea): void
}

@Injectable({
  providedIn: 'root'
})
export class TareasService implements ITareasService {

  constructor(private http: HttpClient) { }

  async todasLasTareas() {
    const tareas = await this.http.get<Tarea[]>(REST_SERVER_URL + '/tareas').toPromise()
    return tareas.map((tarea) => Tarea.fromJson(tarea))
  }

  async getTareaById(id: number) {
    const tarea = await this.http.get<Tarea>(REST_SERVER_URL + '/tareas/' + id).toPromise()
    return Tarea.fromJson(tarea)
  }

  async actualizarTarea(tarea: Tarea) {
    return this.http.put(REST_SERVER_URL + '/tareas/' + tarea.id, tarea.toJSON()).toPromise()
  }

}