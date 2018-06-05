import { Usuario } from "../domain/usuario"
import { Tarea } from "../domain/tarea"
import { of } from "rxjs"
import { ITareasService } from "./tareas.service"

export const juana = new Usuario('Juana Molina')

export class StubUsuariosService {
    usuarios = [new Usuario('John Doe'), juana]

    usuariosPosibles() {
        return this.usuarios
    }
}

export class StubTareasService implements ITareasService {
    tareas = [
        new Tarea(1, "Tarea 1", "Iteracion 1", juana, "10/05/2019", 50), 
        new Tarea(2, "Tarea 2", "Iteracion 1", null, "13/08/2019", 0)
    ]

    todasLasTareas() {
        return of(this.tareas)
    }

    getTareaById(id: number) {
        const tarea = this.tareas.find((tarea) => tarea.id == id)
        return of(tarea)
    }

    actualizarTarea(tarea: Tarea) {}
}