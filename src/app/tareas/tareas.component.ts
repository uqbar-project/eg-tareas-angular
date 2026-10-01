import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'
import { IconComponent } from 'app/icon.component'
import { Tarea } from 'domain/tarea'
import { EstadoCumplimientoPipe } from 'pipes/estadoCumplimiento.pipe'
import { FilterTareas } from 'pipes/filterTareas.pipe'
import { OrderTareas } from 'pipes/orderTareas.pipe'
import { TareasService } from 'services/tareas.service'
import { mostrarError } from 'util/errorHandler'

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FilterTareas,
    OrderTareas,
    EstadoCumplimientoPipe,
    IconComponent
  ],
  templateUrl: './tareas.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './tareas.component.css'
})
export class TareasComponent implements OnInit {
  tareaBuscada = ''
  tareas: Array<Tarea> = []
  errors = []

  constructor(
    public tareasService: TareasService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.obtenerTodasLasTareas()
  }

  async actualizarTarea(
    callbackActualizacion: (tarea: Tarea) => void,
    tarea: Tarea
  ) {
    callbackActualizacion(tarea)
    this.cdr.markForCheck()
    try {
      await this.tareasService.actualizarTarea(tarea)
    } catch (e) {
      await errorHandler(this, e)
    }
  }

  async cumplir(tarea: Tarea) {
    await this.actualizarTarea((tarea: Tarea) => {
      tarea.cumplir()
    }, tarea)
  }

  async desasignar(tarea: Tarea) {
    await this.actualizarTarea((tarea: Tarea) => {
      tarea.desasignar()
    }, tarea)
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
      this.cdr.markForCheck()
      console.info('Tareas obtenidas', this.tareas)
    } catch (error) {
      mostrarError(this, error)
    }
  }
}

export const errorHandler = async (
  component: TareasComponent,
  error: unknown
) => {
  try {
    component.tareas = await component.tareasService.todasLasTareas()
  } catch (e) {}
  mostrarError(component, error)
}
