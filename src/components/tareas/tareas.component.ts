import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { Tarea } from '../../domain/tarea'
import { TareasService } from '../../services/tareas.service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mostrarError(component: any, error: any): void {
  const originalError = error.error ?? error
  let errorMessage = originalError.message
  if (error.status === 0) {
    errorMessage = 'No hay conexión con el backend, revise si el servidor remoto está levantado.'
  } else if (error.status === 500) {
    errorMessage = 'Hubo un error al realizar la operación. Consulte al administrador del sistema.'
    console.error(error)
  }
  component.errors.push(errorMessage)
  // setTimeout(() => {
  //   component.errors.length = 0
  // }, 3000)
}

const errorHandler = (component: TareasComponent) => ({
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

  async actualizarTarea(callbackActualizacion: (tarea: Tarea) => void, tarea: Tarea) {
    try {
      callbackActualizacion(tarea)
      await this.tareasService.actualizarTarea(tarea).subscribe(errorHandler(this))
    } catch (error) {
      mostrarError(this, error)
      await this.obtenerTodasLasTareas()
    }
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
