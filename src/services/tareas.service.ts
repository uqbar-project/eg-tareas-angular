import { Observable } from "rxjs";
import { Tarea, TareaJSON } from "src/domain/tarea";

export abstract class TareasService {
    abstract todasLasTareas(): Promise<Tarea[]>
    abstract getTareaById(id: number): Promise<Tarea | undefined>
    abstract actualizarTarea(tarea: Tarea): Observable<TareaJSON>
    abstract crearTarea(tarea: Tarea): Promise<void>
}