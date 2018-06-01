import { Component, OnInit } from '@angular/core'
import { TareasService } from "../../services/tareas.service"
import { Tarea } from "../../domain/tarea"
import { Usuario } from "../../domain/usuario"
import { DialogService } from "ng2-bootstrap-modal"

@Component({
  selector: 'my-app',
  templateUrl: './tareas.component.html',
  providers: [TareasService]
})
export class TareasComponent implements OnInit {

  private tareaBuscada: string = ''
  private tareas = []
  private errors = []

  constructor(private tareasService: TareasService) { }

  ngOnInit() {
    this.tareasService.todasLasTareas().subscribe(
      data => this.tareas = data,
      error => this.errors.push(error))
  }

  public cumplir(tarea: Tarea) {
    tarea.cumplir()
    this.tareasService.actualizarTarea(tarea)
  }

  public desasignar(tarea: Tarea) {
    tarea.desasignar()
    this.tareasService.actualizarTarea(tarea)
  }

  mostrarModal(tarea: Tarea) {
    // this._dialogService.addDialog(ComboUsuariosComponent, {tarea: tarea})
  }
}