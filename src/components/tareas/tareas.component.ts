import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Tarea } from '../../domain/tarea'
import { TareasService } from '../../services/tareas.service'

function mostrarError(component, error) {
  console.log('error', error)
  component.errors.push(error.error)
}
@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  providers: []
})
export class TareasComponent implements OnInit {
  tareaBuscada = ''
  tareas: Array<Tarea> = []
  errors = []

  constructor(private tareasService: TareasService, private router: Router) { }

  async ngOnInit() {
    try {
      this.tareas = this.ordenarTareasPorId(await this.tareasService.todasLasTareas())
    } catch (error) {
      mostrarError(this, error)
    }
  }

  ordenarTareasPorId(tareas: Tarea[]) {
    return tareas.sort(function (tarea, otraTarea) {
      return tarea.id - otraTarea.id
    })
  }

  async cumplir(tarea: Tarea) {
    try {
      tarea.cumplir()
      await this.tareasService.actualizarTarea(tarea)
    } catch (error) {
      mostrarError(this, error)
    }
  }

  async desasignar(tarea: Tarea) {
    try {
      tarea.desasignar()
      this.tareasService.actualizarTarea(tarea)
    } catch (error) {
      mostrarError(this, error)
    }
  }

  asignar(tarea: Tarea) {
    this.router.navigate(['/asignarTarea', tarea.id])
  }

}
