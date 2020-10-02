import { Usuario } from './usuario'

const CUMPLIDA = 100

export class Tarea {
    constructor(public id?: number, public descripcion?: string, private iteracion?: string, public asignatario?: Usuario, private fecha?: string, private porcentajeCumplimiento?: number) { }

    static fromJson(tareaJSON): Tarea {
        return Object.assign(new Tarea(), tareaJSON, { asignatario: Usuario.fromJSON(tareaJSON.asignadoA) })
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

    toJSON(): any {
        return {
            ...this,
            asignatario: null,
            asignadoA: this.asignatario ? this.asignatario.nombre : ''
        }
    }

}
