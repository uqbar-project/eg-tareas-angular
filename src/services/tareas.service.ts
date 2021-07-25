import { TareaJSON } from './../domain/tarea'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { Tarea } from '../domain/tarea'
import { REST_SERVER_URL } from './configuration'

export interface ITareasService {
  todasLasTareas(): Promise<Tarea[]>
  getTareaById(id: number): Promise<Tarea | undefined>
  actualizarTarea(tarea: Tarea): Promise<void>
}

@Injectable({
  providedIn: 'root'
})
export class TareasService implements ITareasService {

  constructor(private http: HttpClient) { }

  async todasLasTareas() {
    const tareas = await this.http.get<TareaJSON[]>(REST_SERVER_URL + '/tareas').toPromise()
    return tareas.map((tareaJSON) => Tarea.fromJson(tareaJSON))
  }

  async getTareaById(id: number) {
    const tareaJSON = await this.http.get<TareaJSON>(REST_SERVER_URL + '/tareas/' + id).toPromise()
    return tareaJSON ? Tarea.fromJson(tareaJSON) : undefined
  }

  async actualizarTarea(tarea: Tarea) {
    // no tiene efecto ubicar aquí un await, porque no hay línea siguiente, 
    // pero ojo porque si agregamos otra línea que depende de la actualización, necesita el await
    await this.http.put(REST_SERVER_URL + '/tareas/' + tarea.id, tarea.toJSON()).toPromise()
  }

}