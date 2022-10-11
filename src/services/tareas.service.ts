import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { lastValueFrom } from 'rxjs'

import { Tarea } from '../domain/tarea'
import { TareaJSON } from './../domain/tarea'
import { REST_SERVER_URL } from './configuration'

@Injectable({
  providedIn: 'root'
})
export class TareasService {
  constructor(private httpClient: HttpClient) { }

  async todasLasTareas() {
    const tareas$ = this.httpClient.get<TareaJSON[]>(REST_SERVER_URL + '/tareas')
    const tareas = await lastValueFrom(tareas$)
    return tareas.map((tareaJSON) => Tarea.fromJson(tareaJSON))
  }

  async getTareaById(id: number) {
    const tareaJSON$ = this.httpClient.get<TareaJSON>(REST_SERVER_URL + '/tareas/' + id)
    const tareaJSON = await lastValueFrom(tareaJSON$)
    return tareaJSON ? Tarea.fromJson(tareaJSON) : undefined
  }

  actualizarTarea(tarea: Tarea) {
    return this.httpClient.put<TareaJSON>(REST_SERVER_URL + '/tareas/' + tarea.id, tarea.toJSON())
  }

  async crearTarea(tarea: Tarea) {
    await lastValueFrom(this.httpClient.post(REST_SERVER_URL + '/tareas', tarea.toJSON()))
  }

}