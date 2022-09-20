import { mostrarError } from './../tareas/tareas.component'
import { Router } from '@angular/router'
import { TareasService } from './../../services/tareas.service'
import { UsuariosService } from './../../services/usuarios.service'
import { Usuario } from 'src/domain/usuario'
import { Tarea } from 'src/domain/tarea'
import { Component } from '@angular/core'
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns'

@Component({
  selector: 'app-nuevaTarea',
  templateUrl: './nuevaTarea.component.html',
  styleUrls: ['./nuevaTarea.component.css']
})
export class NuevaTareaComponent {

  tarea: Tarea = new Tarea()
  asignatario?: Usuario
  usuariosPosibles: Usuario[] = []
  errors: string[] = []
  faCalendar = faCalendar
  opcionesFecha!: IAngularMyDpOptions

  constructor(private usuariosService: UsuariosService, private tareasService: TareasService, private router: Router) { }

  async ngOnInit() {
    try {
      await this.initialize()
    } catch (error) {
      mostrarError(this, error)
    }
  }

  async initialize() {
    // Llenamos el combo de usuarios
    const usuarios = await this.usuariosService.usuariosPosibles()
    this.usuariosPosibles = usuarios.map(usuarioJson => new Usuario(usuarioJson.nombre))

    this.opcionesFecha = {
      dateFormat: 'dd/mm/yyyy',
      dateRange: false,
    }

    this.asignatario = undefined
  }

  async guardar() {
    try {
      this.tarea.validar()
      if (this.tarea.invalid()) {
        return
      }
      this.tarea.asignarA(this.asignatario)
      await this.tareasService.crearTarea(this.tarea)
      this.navegarAHome()
    } catch (error) {
      mostrarError(this, error)
    }
  }

  navegarAHome() {
    this.router.navigateByUrl('/')
  }

  fechaSeleccionada(event: IMyDateModel): void {
    if (event.singleDate && event.singleDate.jsDate) {
      this.tarea.fecha = format(event.singleDate.jsDate, 'dd/MM/yyyy')
    }
  }
}
