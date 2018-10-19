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
  tarea: Tarea
  asignatario: Usuario
  usuariosPosibles = []
  errors = []

  constructor(private usuariosService: UsuariosService, private tareasService: TareasService, private router: Router, private route: ActivatedRoute) {
    try {
      this.initialize()
    } catch(error) {
      this.errors.push(error._body)
    } 

    // Truco para que refresque la pantalla 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
  }

  ngOnInit() { }

  async initialize() {
    // Llenamos el combo de usuarios
    const res = await this.usuariosService.usuariosPosibles()
    this.usuariosPosibles = res.json().map(usuarioJson => new Usuario(usuarioJson.nombre))

    // Dado el identificador de la tarea, debemos obtenerlo y mostrar el asignatario en el combo
    const idTarea = this.route.snapshot.params['id']
    const _tarea = await this.tareasService.getTareaById(idTarea).toPromise()
    this.tarea = _tarea
    this.asignatario = this.usuariosPosibles.find(usuarioPosible => usuarioPosible.equals(this.tarea.asignatario))
  }

  validarAsignacion() {
    if (this.asignatario == null) {
      throw { _body: "Debe seleccionar un usuario" }
    }
  }

  async asignar() {
    try {
      this.errors = []
      this.validarAsignacion()
      this.tarea.asignarA(this.asignatario)
      await this.tareasService.actualizarTarea(this.tarea).toPromise()
      this.navegarAHome()
    } catch (e) {
      this.errors.push(e._body)
    }
  }

  navegarAHome() {
    this.router.navigate(['/tareas'])
  }

}