import { Component, OnInit } from '@angular/core'
import { TareasService } from "../../services/tareas.service"
import { Tarea } from "../../domain/tarea"
import { Usuario } from "../../domain/usuario"
import { Router } from '@angular/router'

@Component({
  selector: 'my-app',
  templateUrl: './tareas.component.html',
  providers: [TareasService]
})
export class TareasComponent implements OnInit {

  tareaBuscada: string = ''
  tareas: Array<Tarea> = []
  errors = []

  constructor(private tareasService: TareasService, private router: Router) { }

  ngOnInit() {
    // Truco para que refresque la pantalla 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    
    this.tareasService.todasLasTareas().subscribe(
      data => this.tareas = data,
      error => {
        console.log("error", error)
        this.errors.push(error._body)
      }
    )
  }

  public cumplir(tarea: Tarea) {
    tarea.cumplir()
    this.tareasService.actualizarTarea(tarea)
  }

  public desasignar(tarea: Tarea) {
    tarea.desasignar()
    this.tareasService.actualizarTarea(tarea)
  }

  asignar(tarea: Tarea) {
    this.router.navigate(['/asignarTarea', tarea.id])
  }

}