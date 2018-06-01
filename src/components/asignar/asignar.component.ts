import {Component, Input} from '@angular/core'
import {UsuariosService} from "../../services/usuarios.service"
import {Tarea} from "../../domain/tarea"
import {Usuario} from "../../domain/usuario"
import {TareasService} from "../../services/tareas.service"
import { DialogComponent, DialogService } from "ng2-bootstrap-modal"

@Component({
  selector: 'app-asignar',
  templateUrl: './asignar.component.html',
  providers: [UsuariosService, TareasService],
  styles: []
})
export class AsignarComponent {
  tarea: Tarea
  private asignatario: Usuario
  private usuariosPosibles = []
  private errors = []

  constructor(private usuariosService: UsuariosService, private tareasService: TareasService) { }

  ngOnInit(){
    this.usuariosService.usuariosPosibles().subscribe(data => this.usuariosPosibles = data)
  }

  public asignar() {
    this.errors = []
    if (this.asignatario == null){
      this.errors.push("Debe seleccionar un usuario")
      return
    }
    this.tarea.asignarA(this.asignatario)
    this.tareasService.actualizarTarea(this.tarea)
    // navegar de vuelta this.close()
  }
}