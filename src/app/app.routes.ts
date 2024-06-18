import { Routes } from '@angular/router'
import { TareasComponent } from './tareas/tareas.component'
import { NuevaTareaComponent } from './nueva-tarea/nueva-tarea.component'
import { AsignarComponent } from './asignar/asignar.component'

export const routes: Routes = [
  { path: 'tareas',           component: TareasComponent },
  { path: 'nuevaTarea',       component: NuevaTareaComponent, },
  { path: 'asignarTarea/:id', component: AsignarComponent},
       // pasamos id dentro de la URL para asignar una tarea específica
  { path: '', redirectTo: '/tareas', pathMatch: 'full' },
       // por defecto redirigimos a la lista de tareas
]
