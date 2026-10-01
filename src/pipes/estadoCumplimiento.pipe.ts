import { Pipe, type PipeTransform } from '@angular/core'
import { Tarea } from 'domain/tarea'

/**
 * Traduce el porcentaje de una tarea a la variante del chip: menos de 40,
 * entre 40 y 80, y 80 en adelante. Reusa los predicados del dominio en vez
 * de comparar numeros aca.
 *
 * Es una pipe y no un metodo del componente a proposito: al ser pura Angular
 * memoiza por identidad del argumento, asi que el valor no cambia entre la
 * pasada de refresh y la de checkNoChanges. Un metodo invocado desde el
 * binding se recalcula en cada una de esas pasadas y tira NG0100 cuando el
 * dato de abajo muta.
 */
@Pipe({
  name: 'estadoCumplimiento',
  standalone: true
})
export class EstadoCumplimientoPipe implements PipeTransform {
  transform(tarea: Tarea): string {
    if (tarea.cumplioMenosDe(40)) return 'chip-bajo'
    if (tarea.cumplioMenosDe(80)) return 'chip-medio'
    return 'chip-alto'
  }
}
