import { Usuario } from './usuario'

const CUMPLIDA = 100

export class Tarea {
    constructor(public id?: number, private descripcion?: string, private iteracion?: string, public asignatario?: Usuario, private fecha?: string, private porcentajeCumplimiento?: number) { }

    static fromJson(tareaJSON): Tarea {
        // const result: Tarea = Object.assign(new Tarea(), tareaJSON)
        // result.asignatario = Usuario.fromJSON(tareaJSON.asignadoA)
        // return result
        const tarea = new Tarea()
        tarea.id = tareaJSON.id
        tarea.descripcion = tareaJSON.descripcion
        tarea.iteracion = tareaJSON.iteracion
        tarea.asignatario = Usuario.fromJSON(tareaJSON.asignadoA)
        tarea.fecha = tareaJSON.fecha
        tarea.porcentajeCumplimiento = tareaJSON.porcentajeCumplimiento
        // return Object.assign(new Tarea(), tareaJSON, { asignatario: Usuario.fromJSON(tareaJSON.asignadoA) })
        return tarea
    }

    contiene(palabra: string): boolean {
        return this.descripcion.includes(palabra) || (this.asignatario && this.asignatario.nombre.includes(palabra))
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

    asignarA(asignatario: Usuario) {
        this.asignatario = asignatario
    }

    asignadoA(asignatario: Usuario) {
        return this.asignatario && asignatario && this.asignatario.nombre === asignatario.nombre
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

    toJSON(): any {
        return {
            ...this,
            asignatario: null,
            asignadoA: this.asignatario ? this.asignatario.nombre : ''
        }
    }

}
