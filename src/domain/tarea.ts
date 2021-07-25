import { Usuario } from './usuario'

const CUMPLIDA = 100

export type TareaJSON = {
    id?: number,
    descripcion: string,
    iteracion: string,
    asignadoA: string,
    fecha?: string,
    porcentajeCumplimiento: number
}
export class Tarea {
    constructor(public id?: number, public descripcion: string = '', public iteracion: string = '', public asignatario: Usuario | null = null, public fecha?: string, public porcentajeCumplimiento: number = 0) { }

    static fromJson(tareaJSON: TareaJSON): Tarea {
        return Object.assign(new Tarea(), tareaJSON, { asignatario: Usuario.fromJSON(tareaJSON.asignadoA) })
    }

    contiene(palabra: string): boolean {
        return (this.descripcion || '').includes(palabra) || (!!this.asignatario && (this.asignatario.nombre || '').includes(palabra))
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
        this.asignatario = null
    }

    sePuedeDesasignar() {
        return this.sePuedeCumplir()
    }

    asignarA(asignatario: Usuario | null) {
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
            fecha: this.fecha,
            porcentajeCumplimiento: this.porcentajeCumplimiento,
            asignadoA: !!this.asignatario ? this.asignatario.nombre : ''
        }
    }

    key(): number {
        return this.id || 0
    }
}
