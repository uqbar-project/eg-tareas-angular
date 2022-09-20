import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import { Tarea } from '../../domain/tarea'
import { Usuario } from '../../domain/usuario'
import { TareasService } from '../../services/tareas.service'
import { UsuariosService } from '../../services/usuarios.service'
import { mostrarError } from '../tareas/tareas.component'

@Component({
  selector: 'app-asignar',
  templateUrl: './asignar.component.html',
  providers: [],
  styles: []
})
export class AsignarComponent {
  tarea!: Tarea
  asignatario?: Usuario
  usuariosPosibles: Usuario[] = []
  errors: string[] = []

  constructor(private usuariosService: UsuariosService, private tareasService: TareasService, private router: Router, private route: ActivatedRoute) { }

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

    // Dado el identificador de la tarea, debemos obtenerlo y mostrar el asignatario en el combo
    const idTarea = this.route.snapshot.params['id']
    const tarea = await this.tareasService.getTareaById(idTarea)
    if (!tarea) {
      this.navegarAHome()
    }
    this.tarea = tarea as Tarea
    this.asignatario = this.usuariosPosibles.find(usuarioPosible => this.tarea.estaAsignadoA(usuarioPosible))
  }

  validarAsignacion() {
    if (!this.asignatario) {
      throw { message: 'Debe seleccionar un usuario' }
    }
  }

  async asignar() {
    try {
      this.errors = []
      this.validarAsignacion()
      this.tarea.asignarA(this.asignatario)
      await this.tareasService.actualizarTarea(this.tarea)
      this.navegarAHome()
    } catch (e) {
      console.info(e)
      mostrarError(this, e)
    }
  }

  navegarAHome() {
    this.router.navigate(['/tareas'])
  }

}
