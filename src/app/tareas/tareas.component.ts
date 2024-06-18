import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { IconsModule } from 'app/icons.module'
import { Tarea } from 'domain/tarea'
import { FilterTareas } from 'pipes/filterTareas.pipe'
import { OrderTareas } from 'pipes/orderTareas.pipe'
import { TareasService } from 'services/tareas.service'
import { mostrarError } from 'util/errorHandler'

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FilterTareas, OrderTareas, IconsModule],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css'
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
    callbackActualizacion(tarea)
    try {
      await this.tareasService.actualizarTarea(tarea)
    } catch (e) {
      errorHandler(this)
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

export const errorHandler = (component: TareasComponent) => ({
  error: async (error: Error) => {
    component.tareas = await component.tareasService.todasLasTareas()
    mostrarError(component, error)
  }
})
