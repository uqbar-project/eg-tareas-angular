import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { mostrarError } from 'src/util/errorHandler'

import { Tarea } from 'src/domain/tarea'
import { Usuario } from 'src/domain/usuario'
import { TareasService } from 'src/services/tareas.service'
import { UsuariosService } from 'src/services/usuarios.service'

@Component({
  selector: 'app-asignar',
  templateUrl: './asignar.component.html',
  providers: [],
  styleUrls: ['./asignar.component.css']
})
export class AsignarComponent {
  tarea!: Tarea
  asignatario?: Usuario
  usuariosPosibles: Usuario[] = []
  errors: string[] = []

  constructor(
    private usuariosService: UsuariosService,
    private tareasService: TareasService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
    this.usuariosPosibles = usuarios.map(
      (usuarioJson) => new Usuario(usuarioJson.nombre)
    )

    // Dado el identificador de la tarea, debemos obtenerlo y mostrar el asignatario en el combo
    const idTarea = this.route.snapshot.params['id']
    const tarea = await this.tareasService.getTareaById(idTarea)
    if (!tarea) {
      this.navegarAHome()
    }
    this.tarea = tarea as Tarea
    this.asignatario = this.usuariosPosibles.find((usuarioPosible) =>
      this.tarea.estaAsignadoA(usuarioPosible)
    )
  }

  validarAsignacion() {
    if (!this.asignatario) {
      throw new Error('Debe seleccionar un usuario')
    }
  }

  async asignar() {
    this.errors = []
    try {
      this.validarAsignacion()
    } catch (error) {
      mostrarError(this, error)
      return
    }
    this.tarea.asignarA(this.asignatario)
    this.tareasService.actualizarTarea(this.tarea).subscribe({
      next: () => {
        this.navegarAHome()
      },
      error: (error: Error) => {
        console.error(error)
        mostrarError(this, error)
      }
    })
  }

  navegarAHome() {
    this.router.navigate(['/tareas'])
  }
}
