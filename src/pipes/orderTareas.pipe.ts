import { Pipe, PipeTransform } from '@angular/core';
import { Tarea } from 'src/domain/tarea';

@Pipe({
  name: 'orderTareas'
})
export class OrderTareas implements PipeTransform {

  transform(tareas: Tarea[]): Tarea[] {
    return tareas.sort((tarea, otraTarea) => tarea.id - otraTarea.id)
  }

}
