import {Tarea} from "../domain/tarea"
import {Http, Response} from "@angular/http"
import {Injectable} from "@angular/core"
import { map } from 'rxjs/operators'
import { REST_SERVER_URL } from "./configuration"

@Injectable({
  providedIn: 'root'
})
export class TareasService{

  constructor(private http: Http){}

  public todasLasTareas(){
    return this.http.get(REST_SERVER_URL + "/tareas").pipe(map(this.extractData))
  }

  public actualizarTarea(tarea: Tarea){
    this.http.put(REST_SERVER_URL + "/tareas/" + tarea.id, tarea.toJSON()).subscribe()
  }

  private extractData(res: Response){
    return res.json().map(tareaJSON =>
      Tarea.fromJson(tareaJSON)
    )
  }
}