import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { Tarea } from '../../domain/tarea'
import { TareasService } from '../../services/tareas.service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mostrarError(component: any, error: any): void {
  const errorMessage = (error.status === 0) ? 'No hay conexión con el backend, revise si el servidor remoto está levantado.' : error.error ? error.error.message : error.message
  component.errors.push(errorMessage)
}

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

  constructor(private tareasService: TareasService, private router: Router) { }

  async ngOnInit() {
    try {
      this.tareas = await this.tareasService.todasLasTareas()
    } catch (error) {
      mostrarError(this, error)
    }
  }

  async cumplir(tarea: Tarea) {
    try {
      tarea.cumplir()
      await this.tareasService.actualizarTarea(tarea)
    } catch (error) {
      this.tareas = await this.tareasService.todasLasTareas()
      mostrarError(this, error)
    }
  }

  async desasignar(tarea: Tarea) {
    try {
      tarea.desasignar()
      await this.tareasService.actualizarTarea(tarea)
    } catch (error) {
      this.tareas = await this.tareasService.todasLasTareas()
      mostrarError(this, error)
    }
  }

  crearNuevaTarea() {
    this.router.navigateByUrl('/nuevaTarea')
  }

  asignar(tarea: Tarea) {
    this.router.navigate(['/asignarTarea', tarea.id])
  }

}
