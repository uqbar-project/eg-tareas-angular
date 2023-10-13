import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { mostrarError } from 'src/util/errorHandler'

import { Tarea } from 'src/domain/tarea'
import { TareasService } from 'src/services/tareas.service'


export const errorHandler = (component: TareasComponent) => ({
  error: async (error: Error) => {
    component.tareas = await component.tareasService.todasLasTareas()
    mostrarError(component, error)
  }
})

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css'],
  providers: []
})
export class TareasComponent implements OnInit {
  tareaBuscada = ''
  tareas: Array<Tarea> = []
  errors = []

  constructor(public tareasService: TareasService, private router: Router) { }

  async ngOnInit() {
    await this.obtenerTodasLasTareas()
  }

  actualizarTarea(callbackActualizacion: (tarea: Tarea) => void, tarea: Tarea) {
    callbackActualizacion(tarea)
    this.tareasService.actualizarTarea(tarea).subscribe(errorHandler(this))
  }

  async cumplir(tarea: Tarea) {
    await this.actualizarTarea((tarea: Tarea) => { tarea.cumplir() }, tarea)
  }

  async desasignar(tarea: Tarea) {
    await this.actualizarTarea((tarea: Tarea) => { tarea.desasignar() }, tarea)
  }

  crearNuevaTarea() {
    this.router.navigateByUrl('/nuevaTarea')
  }

  asignar(tarea: Tarea) {
    this.router.navigate(['/asignarTarea', tarea.id])
  }

  async obtenerTodasLasTareas() {
    try {
      this.tareas = await this.tareasService.todasLasTareas()
    } catch (error) {
      mostrarError(this, error)
    }
  }

}
