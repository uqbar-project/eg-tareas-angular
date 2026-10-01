import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Tarea } from 'domain/tarea'
import { Usuario } from 'domain/usuario'
import { TareasService } from 'services/tareas.service'
import { UsuariosService } from 'services/usuarios.service'
import { mostrarError } from 'util/errorHandler'

@Component({
  selector: 'app-asignar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './asignar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './asignar.component.css'
})
export class AsignarComponent {
  tarea = signal<Tarea | undefined>(undefined)
  asignatario = signal<Usuario | undefined>(undefined)
  usuariosPosibles = signal<Usuario[]>([])
  errors = signal<string[]>([])

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
    this.usuariosPosibles.set(
      usuarios.map(usuarioJson => new Usuario(usuarioJson.nombre))
    )

    // Dado el identificador de la tarea, debemos obtenerlo y mostrar el asignatario en el combo
    // biome-ignore lint/complexity/useLiteralKeys: tsconfig activa noPropertyAccessFromIndexSignature
    const idTarea = this.route.snapshot.params['id']
    const tarea = await this.tareasService.getTareaById(idTarea)
    if (!tarea) {
      this.navegarAHome()
    }
    this.tarea.set(tarea as Tarea)
    this.asignatario.set(
      this.usuariosPosibles().find(usuarioPosible =>
        (tarea as Tarea).estaAsignadoA(usuarioPosible)
      )
    )
  }

  validarAsignacion() {
    if (!this.asignatario()) {
      throw new Error('Debe seleccionar un usuario')
    }
  }

  async asignar() {
    this.errors.set([])
    try {
      this.validarAsignacion()
    } catch (error) {
      mostrarError(this, error)
      return
    }
    const tarea = this.tarea() as Tarea
    tarea.asignarA(this.asignatario() as Usuario)
    try {
      await this.tareasService.actualizarTarea(tarea)
      this.navegarAHome()
    } catch (error: unknown) {
      console.error(error)
      mostrarError(this, error)
    }
  }

  navegarAHome() {
    this.router.navigate(['/tareas'])
  }
}
