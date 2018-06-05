import { Component, Input } from '@angular/core'
import { UsuariosService } from "../../services/usuarios.service"
import { Tarea } from "../../domain/tarea"
import { Usuario } from "../../domain/usuario"
import { TareasService } from "../../services/tareas.service"
import { DialogComponent, DialogService } from "ng2-bootstrap-modal"
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-asignar',
  templateUrl: './asignar.component.html',
  providers: [UsuariosService, TareasService],
  styles: []
})
export class AsignarComponent {
  tarea$: Tarea
  asignatario: Usuario
  usuariosPosibles = []
  errors = []

  constructor(private usuariosService: UsuariosService, private tareasService: TareasService, private router: Router, private route: ActivatedRoute) {
    // Llenamos el combo de usuarios
    this.usuariosService.usuariosPosibles().then(
      res => {
        this.usuariosPosibles = res.json().map(usuarioJson => new Usuario(usuarioJson.nombre))
        // Dado el identificador de la tarea, debemos obtenerlo y mostrar el asignatario en el combo
        this.route.params.subscribe(params => {
          this.tareasService.getTareaById(params['id']).subscribe(data => {
            this.tarea$ = data
            this.asignatario = this.usuariosPosibles.find(usuarioPosible => usuarioPosible.equals(this.tarea$.asignatario))
          }
        )})
      }
    ).catch(error => this.errors.push(error))

    // Truco para que refresque la pantalla 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
  }

  ngOnInit() { }

  asignar() {
    this.errors = []
    if (this.asignatario == null) {
      this.errors.push("Debe seleccionar un usuario")
      return
    }
    this.tarea$.asignarA(this.asignatario)
    this.tareasService.actualizarTarea(this.tarea$)
    this.navegarAHome()
  }

  navegarAHome() {
    this.router.navigate(['/tareas'])
  }

}