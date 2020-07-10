import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Tarea } from '../../domain/tarea'
import { TareasService } from '../../services/tareas.service'
import { faUserCheck, faUserMinus, faCalendarCheck} from "@fortawesome/free-solid-svg-icons";

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
  faCalendarCheck = faCalendarCheck
  faUserCheck = faUserCheck
  faUserMinus = faUserMinus
  tareaBuscada = ''
  tareas: Array<Tarea> = []
  errors = []

  constructor(private tareasService: TareasService, private router: Router) { }

  async ngOnInit() {
    try {
      // Truco para que refresque la pantalla
      this.router.routeReuseStrategy.shouldReuseRoute = () => false
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
