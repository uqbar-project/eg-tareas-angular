import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tarea } from "../../domain/tarea";
import { TareasService } from "../../services/tareas.service";

function mostrarError(component, error) {
  console.log("error", error)
  component.errors.push(error._body)
}
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
      error => mostrarError(this, error)
      // otra opción mostrarError.bind(this)
    )
  }

  public cumplir(tarea: Tarea) {
    this.tareasService.actualizarTarea(tarea).subscribe(
      () => { tarea.cumplir() },
      error => {
        console.log("error", error)
        this.errors.push(error._body)
      }
    )
  }

  public desasignar(tarea: Tarea) {
    tarea.desasignar()
    this.tareasService.actualizarTarea(tarea)
  }

  asignar(tarea: Tarea) {
    this.router.navigate(['/asignarTarea', tarea.id])
  }

}