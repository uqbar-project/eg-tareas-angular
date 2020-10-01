import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { Tarea } from '../domain/tarea'
import { REST_SERVER_URL } from './configuration'

export interface ITareasService {
  todasLasTareas(): Promise<Tarea[]>
  getTareaById(id: number): Promise<Tarea>
  actualizarTarea(tarea: Tarea): Promise<void>
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
    // no tiene efecto ubicar aquí un await, porque no hay línea siguiente, 
    // pero ojo porque si agregamos otra línea que depende de la actualización, necesita el await
    await this.http.put(REST_SERVER_URL + '/tareas/' + tarea.id, tarea.toJSON()).toPromise()
  }

}