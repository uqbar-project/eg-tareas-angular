import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AsignarComponent } from '../components/asignar/asignar.component'
import { TareasComponent } from '../components/tareas/tareas.component'

const routes: Routes = [
  { path: '', redirectTo: '/tareas', pathMatch: 'full' },
  // por defecto redirigimos a la lista de tareas
  { path: 'tareas', component: TareasComponent },
  { path: 'asignarTarea/:id', component: AsignarComponent },
  // pasamos id dentro de la URL para asignar una tarea específica
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

export const routingComponents = [TareasComponent, AsignarComponent]
