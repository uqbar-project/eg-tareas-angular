import { Pipe, type PipeTransform } from '@angular/core'

/**
 * Traduce un porcentaje de cumplimiento a la variante del chip: menos de 40,
 * entre 40 y 80, y 80 en adelante.
 *
 * Ojo con el argumento: recibe el **numero**, no la Tarea. Las pipes puras
 * memoizan por identidad de cada argumento, y `cumplir()` muta la Tarea en
 * sitio, asi que la referencia no cambia y una pipe que reciba el objeto
 * devolveria el valor cacheado: el chip se quedaria con el color viejo
 * despues de cumplir. Con un primitivo el argumento si cambia (50 -> 100) y
 * la pipe vuelve a correr.
 *
 * Los cortes son 40 y 80 a proposito: son una decision de presentacion, no del
 * dominio, asi que no van en la clase Tarea.
 */
@Pipe({
  name: 'estadoCumplimiento',
  standalone: true
})
export class EstadoCumplimientoPipe implements PipeTransform {
  transform(porcentaje: number): string {
    if (porcentaje < 40) return 'chip-bajo'
    if (porcentaje < 80) return 'chip-medio'
    return 'chip-alto'
  }
}
