import { NuevaTareaComponent } from './../components/nuevaTarea/nuevaTarea.component'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AsignarComponent } from 'src/components/asignar/asignar.component'
import { TareasComponent } from 'src/components/tareas/tareas.component'

const routes: Routes = [
  { path: 'tareas',           component: TareasComponent },
  { path: 'nuevaTarea',       component: NuevaTareaComponent, },
  { path: 'asignarTarea/:id', component: AsignarComponent},
       // pasamos id dentro de la URL para asignar una tarea específica
  { path: '', redirectTo: '/tareas', pathMatch: 'full' },
       // por defecto redirigimos a la lista de tareas
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [ 
  AsignarComponent,
  NuevaTareaComponent,
  TareasComponent, 
]