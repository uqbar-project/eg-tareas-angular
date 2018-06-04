import {PipeTransform, Pipe, Injectable} from "@angular/core"
import {Tarea} from "../domain/tarea"

@Pipe({
  name: 'filterTareas'
})
export class FilterTareas implements PipeTransform {

  transform(tareas: Tarea[], palabra: string): any {
    return tareas.filter(tarea => tarea.contiene(palabra))
  }

}