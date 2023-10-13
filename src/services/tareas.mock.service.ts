import { Observable, of, throwError } from 'rxjs'
import { Tarea, TareaJSON } from '../domain/tarea'
import { Usuario } from '../domain/usuario'
import { TareasService } from './tareas.service'
import * as dayjs from 'dayjs'
import { juana } from './ususarios.mock.service'
import { Injectable } from '@angular/core'

@Injectable()
export class TareasMockService implements TareasService {
  nextId = 3
  tareas = [
    new Tarea(1, 'Tarea 1', 'Iteracion 1', juana, dayjs('2019-05-10'), 50),
    new Tarea(2, 'Tarea 2', 'Iteracion 1', undefined, dayjs('2019-08-13'), 0)
  ]

  async todasLasTareas() {
    return this.tareas
  }

  async getTareaById(id: number) {
    return this.tareas.find((tarea) => tarea.id == id)
  }

  actualizarTarea(tarea: Tarea) {
    this.tareas = this.tareas.map((tareaItem) =>
      tarea.id == tareaItem.id ? tarea : tareaItem
    )
    return of(tarea.toJSON())
  }

  async crearTarea(tarea: Tarea) {
    tarea.id = this.nextId++
    this.tareas.push(tarea)
  }
}
