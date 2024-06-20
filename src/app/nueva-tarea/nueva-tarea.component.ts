import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { ValidationFieldComponent } from 'app/validation-field/validation-field.component'
import { Tarea } from 'domain/tarea'
import { Usuario } from 'domain/usuario'
import { TareasService } from 'services/tareas.service'
import { UsuariosService } from 'services/usuarios.service'
import { mostrarError } from 'util/errorHandler'

@Component({
  selector: 'app-nueva-tarea',
  standalone: true,
  imports: [FormsModule, ValidationFieldComponent],
  templateUrl: './nueva-tarea.component.html',
  styleUrl: './nueva-tarea.component.css'
})
export class NuevaTareaComponent {
  tarea: Tarea = new Tarea()
  asignatario?: Usuario
  usuariosPosibles: Usuario[] = []
  errors: string[] = []

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

}
