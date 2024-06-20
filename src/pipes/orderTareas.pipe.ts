import { Pipe, PipeTransform } from '@angular/core'
import { Tarea } from 'domain/tarea'

@Pipe({
  name: 'orderTareas',
  standalone: true,
})
export class OrderTareas implements PipeTransform {

  transform(tareas: Tarea[]): Tarea[] {
    return tareas.sort((tarea, otraTarea) => tarea.key() - otraTarea.key())
  }

}
