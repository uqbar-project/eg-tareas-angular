import { Tarea } from '../domain/tarea'
import { Usuario } from '../domain/usuario'
import { ITareasService } from './tareas.service'

export const juana = new Usuario('Juana Molina')

export class StubUsuariosService {

  async usuariosPosibles() {
    return [juana, new Usuario('John Doe')]
  }
}

export class StubTareasService implements ITareasService {
  tareas = [
    new Tarea(1, 'Tarea 1', 'Iteracion 1', juana, '10/05/2019', 50),
    new Tarea(2, 'Tarea 2', 'Iteracion 1', null, '13/08/2019', 0)
  ]

  async todasLasTareas() {
    return this.tareas
  }

  async getTareaById(id: number) {
    return this.tareas.find((tarea) => tarea.id === id)
  }

  async actualizarTarea(tarea: Tarea) { }
}
