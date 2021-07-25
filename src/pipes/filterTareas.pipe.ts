import { PipeTransform, Pipe } from '@angular/core'
import { Tarea } from '../domain/tarea'

@Pipe({
  name: 'filterTareas'
})
export class FilterTareas implements PipeTransform {

  transform(tareas: Tarea[], palabra: string): Tarea[] {
    return tareas.filter(tarea => tarea.contiene(palabra))
  }

}
