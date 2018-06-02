import { Component, OnInit } from '@angular/core'
import { TareasService } from "../../services/tareas.service"
import { Tarea } from "../../domain/tarea"
import { Usuario } from "../../domain/usuario"
import { DialogService } from "ng2-bootstrap-modal"
import { Router } from '@angular/router'

@Component({
  selector: 'my-app',
  templateUrl: './tareas.component.html',
  providers: [TareasService]
})
export class TareasComponent implements OnInit {

  private tareaBuscada: string = ''
  private tareas: Array<Tarea> = []
  private errors = []

  constructor(private tareasService: TareasService, private router: Router) { }

  ngOnInit() {
    this.tareasService.todasLasTareas().subscribe(
      data => this.tareas = data,
      error => this.errors.push(error)
    )
  }

  public cumplir(tarea: Tarea) {
    tarea.cumplir()
    this.tareasService.actualizarTarea(tarea)
  }

  public desasignar(tarea: Tarea) {
    tarea.desasignar()
    console.log(tarea)
    this.tareasService.actualizarTarea(tarea)
  }

  asignar(tarea: Tarea) {
    this.router.navigate(['/asignarTarea', tarea.id])
  }

}