import { Dayjs } from 'dayjs'
import { Usuario } from './usuario'
import { FORMATO_FECHA } from 'src/services/configuration'
import * as dayjs from 'dayjs'

const CUMPLIDA = 100

export type TareaJSON = {
    id?: number,
    descripcion: string,
    iteracion: string,
    asignadoA?: string,
    fecha?: string,
    porcentajeCumplimiento: number
}

export class ValidationMessage {
    constructor(public field: string, public message: string) {}
}

export class Tarea {
    errors: ValidationMessage[] = []

    constructor(public id?: number, public descripcion: string = '', public iteracion: string = '', public asignatario?: Usuario, public fecha?: Dayjs, public porcentajeCumplimiento: number = 0) { }

    static fromJson(tareaJSON: TareaJSON): Tarea {
        return Object.assign(new Tarea(), tareaJSON, { 
          asignatario: tareaJSON.asignadoA ? Usuario.fromJSON(tareaJSON.asignadoA) : undefined,
          fecha: dayjs(tareaJSON.fecha, FORMATO_FECHA)
        })
    }

    contiene(palabra: string): boolean {
        return (this.descripcion.toUpperCase() || '').includes(palabra.toUpperCase()) || (!!this.asignatario && (this.asignatario.nombre.toUpperCase() || '').includes(palabra.toUpperCase()))
    }

    cumplio(porcentaje: number): boolean {
        return this.porcentajeCumplimiento === porcentaje
    }

    cumplioMenosDe(porcentaje: number): boolean {
        return this.porcentajeCumplimiento < porcentaje
    }

    sePuedeCumplir(): boolean {
        return this.porcentajeCumplimiento < CUMPLIDA && this.estaAsignada()
    }

    cumplir() {
        this.porcentajeCumplimiento = CUMPLIDA
    }

    desasignar() {
        this.asignatario = undefined
    }

    sePuedeDesasignar() {
        return this.sePuedeCumplir()
    }

    asignarA(asignatario?: Usuario) {
        this.asignatario = asignatario
    }

    estaAsignadoA(asignatario: Usuario) {
        return this.asignatario && this.asignatario.equals(asignatario)
    }

    sePuedeAsignar(): boolean {
        return !this.estaCumplida()
    }

    estaCumplida(): boolean {
        return this.porcentajeCumplimiento === CUMPLIDA
    }

    estaAsignada(): boolean {
        return !!this.asignatario
    }

    toJSON(): TareaJSON {
        return {
            id: this.id,
            descripcion: this.descripcion,
            iteracion: this.iteracion,
            fecha: this.fechaString(),
            porcentajeCumplimiento: this.porcentajeCumplimiento,
            asignadoA: this.asignatario?.nombre,
        }
    }

    fechaString(): string | undefined {
      return this.fecha?.format(FORMATO_FECHA)
    }

    key(): number {
        return this.id || 0
    }

    invalid(): boolean {
      return this.errors.length > 0
    }

    hasErrors(field: string): boolean {
      return this.errors.some((_) => _.field == field)
    }
  
    errorsFrom(field: string) {
      return this.errors.filter((_) => _.field == field).map((_) => _.message).join(". ")
    }

    addError(field: string, message: string) {
      this.errors.push(new ValidationMessage(field, message))
    }

    validar() {
      this.errors = []
      if (!this.descripcion) {
        this.addError('descripcion', 'Debe ingresar descripción')
      }
      if (!this.iteracion) {
        this.addError('iteracion', 'Debe ingresar iteración')
      }
      if (!this.fecha) {
        this.addError('fecha', 'Debe ingresar fecha')
      }
      if (this.porcentajeCumplimiento < 0) {
        this.addError('porcentajeCumplimiento', 'El porcentaje debe ser positivo')
      }
      if (this.porcentajeCumplimiento > 100) {
        this.addError('porcentajeCumplimiento', 'El porcentaje no puede ser superior a 100')
      }
    }
}
