
# Tareas de un equipo de desarrollo

TODO: Build de travis

![demo](videos/TareasDemo.gif)

Este ejemplo se basa en el seguimiento de tareas de un equipo de desarrollo y permite mostrar una aplicación completa en Angular con los siguientes conceptos

- **routing** de páginas master / detail de tareas
- utilización de Bootstrap 4 como framework de CSS + Font Awesome para los íconos
- desarrollo de front-end en Angular utilizando **servicios REST** desde el backend (por ejemplo, con XTRest)
- para lo cual es necesario la inyección del objeto **httpClient** dentro de los objetos service
- la **separación de concerns** entre las tareas como objeto de dominio, la vista html, el componente que sirve como modelo de vista y el servicio que maneja el origen de los datos
- el manejo del **asincronismo** para recibir parámetros en la ruta, así como para disparar actualizaciones y consultas hacia el backend
- de yapa, repasaremos el uso de **pipes built-in** para formatear decimales en los números y uno propio para realizar el filtro de tareas en base a un valor ingresado

# Preparación del proyecto

## Levantar el backend

Pueden descargar [la implementación XTRest del backend](https://github.com/uqbar-project/eg-tareas-xtrest). En el README encontrarán información de cómo levantar el servidor en el puerto 9000.

## Componentes adicionales

La instalación de los componentes adicionales luego de hacer `ng new eg-tareas-angular --routing` requiere estos pasos:

```bash
$ npm install ng2-bootstrap-modal --save
$ npm install popper --save
$ npm install jquery --save
$ npm install bootstrap --save
$ npm install @fortawesome/fontawesome-svg-core --save
$ npm install @fortawesome/free-solid-svg-icons --save
$ npm install @fortawesome/angular-fontawesome --save
```

Es decir, instalaremos bootstrap y [font awesome para Angular](https://github.com/FortAwesome/angular-fontawesome) principalmente. 

## Agregado en package.json

Es necesario incorporar Bootstrap 4 dentro del archivo _package.json_ de la siguiente manera:

```json
    "styles": [
        "src/styles.css",
        "./node_modules/bootstrap/dist/css/bootstrap.min.css"
    ],
    "scripts": [
        "./node_modules/jquery/dist/jquery.slim.min.js",
        "./node_modules/bootstrap/dist/js/bootstrap.min.js"
    ]
```

## Configuración Browser para evitar CORS

Dado que desde el front-end vamos a levantar un web server en el puerto 4200 y vamos a acceder al puerto 9000 donde está el server, técnicamente constituyen **dominios diferentes**, por lo que debemos habilitar el intercambio de recursos entre dichos orígenes diferentes, lo que se conoce como **CORS** por sus siglas en inglés (Cross-Origin Resource Sharing). De esa manera podremos hacer consultas y actualizaciones al backend sin que el navegador lo rechace por estar fuera del dominio localhost:4200.

Para hacer esto debemos instalar [el siguiente plugin para Chrome](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en-US), lo que nos permitirá que aparezca a la derecha de la URL un ícono para activarlo o desactivarlo convenientemente.


## Configuración ruteo

La aplicación tendrá dos páginas:

- la vista master que muestra la lista de tareas (pendientes o cumplidas)
- y la vista de detalle que sirve para asignar un recurso a una tarea

Recordamos que se definen en el archivo _app/app-routing.module.ts_ que se crea cuando hacemos `ng new nombre-app --routing`:

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/tareas', pathMatch: 'full' },
       // por defecto redirigimos a la lista de tareas
  { path: 'tareas',     component: TareasComponent },
  { path: 'asignarTarea/:id', component: AsignarComponent} 
       // pasamos id dentro de la URL para asignar una tarea específica
]

...

export const routingComponents = [ TareasComponent, AsignarComponent ]
```

## Configuración del NgModule

Los routing components se importan en el módulo (archivo _app/app.module.ts_):

```
import { AppRoutingModule, routingComponents } from './app-routing.module'

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    ...
],
```

También es necesario que importemos las definiciones de Font Awesome, y esto incluye lamentablemente cada uno de los íconos que vayamos a utilizar. Otra opción es importar todos los íconos del framework, pero esta es una práctica totalmente desaconsejable, ya que produce que el _bundle_ sea bastante voluminoso. Un bundle es lo más parecido a un ejecutable web, y se genera en base a todas las definiciones que hacemos en nuestros archivos (los de typescript se traspilan a javascript soportados por cualquier browser). Vemos entonces cómo es el import de los íconos, que incluye la llamada a una librería:

```typescript
// Font Awesome para los íconos
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserCheck, faUserMinus, faCalendarCheck, faTasks } from '@fortawesome/free-solid-svg-icons'

library.add(faUserCheck, faUserMinus, faCalendarCheck, faTasks)
//
``` 

Y por último dado que vamos a formatear a dos decimales con coma el % de completitud de una tarea, debemos importar los _locales_ o configuraciones regionales:

```typescript
/** Registramos el locale ES para formatear números */
import { registerLocaleData } from '@angular/common'
import localeEs from '@angular/common/locales/es'

registerLocaleData(localeEs)
//
```

El import final del NgModule queda:

```typescript
@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    FilterTareas
],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

# Resumen de la arquitectura

![image](images/Arquitectura.png)

## Objetos de dominio

La tarea es un objeto de dominio al que podemos

- asignarle una persona para que la realice
- determinar si se puede asignar, esto ocurre mientras no esté cumplida
- desasignarle la persona actual
- saber si se puede cumplir una tarea o desasignarle una persona, siempre que tenga una persona asignada y no esté cumplida
- marcarla como cumplida

Todas estas responsabilidades hacen que exista una clase Tarea, en lugar de un simple JSON. Pero además como vamos a recibir una Tarea desde el backend que sí es un JSON, vamos a incorporarle dos servicios: la exportación de un objeto Tarea a su correspondiente JSON y la importación de un JSON para crear un objeto tarea. El primero se implementa con un método de instancia toJSON(), el segundo requiere crear una tarea, por lo que el método fromJSON() es **estático**. El JSON del server tiene esta estructura:

```json
{
    "id": 1,
    "descripcion": "Desarrollar componente de envio de mails",
    "iteracion": "Iteración 1",
    "porcentajeCumplimiento": 0,
    "new": false,
    "asignadoA": "Juan Contardo",
    "fecha": "02/06/2018"
}
``` 

Para el caso de id, descripcion, iteracion, porcentajeCumplimiento y fecha, los campos devueltos coinciden con los nombres y tipos definidos para la clase Tarea. En cuanto al atributo **new** que es inyectado por el framework Jackson de XTRest, es descartado ya que el atributo id es el que se utiliza para saber si el objeto fue agregado a la colección del backend. Por último tenemos el campo **asignadoA**, que es un String vs. Tarea.asignatario que en el frontend apunta a un objeto Usuario. Entonces debemos adaptar este _gap_ de la siguiente manera:

- en el fromJson() debemos tomar el string y convertirlo a un objeto Usuario cuyo nombre será ese string. Actualizamos la variable asignatario con ese usuario.
- en el toJson() generamos un Json con un atributo "asignadoA" que contiene el nombre del usuario asignatario

Los atributos de Tarea son privados, a excepción del asignatario ya que lo necesitan otros objetos.

```typescript
export class Tarea {
    constructor(public id?: number, private descripcion?: string, private iteracion?: number, public asignatario?: Usuario, private fecha?: string, private porcentajeCumplimiento?: number) { }

    contiene(palabra: string): boolean {
        return this.descripcion.includes(palabra) || this.asignatario.nombre.includes(palabra)
    }

    cumplio(porcentaje: number): boolean {
        return this.porcentajeCumplimiento == porcentaje
    }

    cumplioMenosDe(porcentaje: number): boolean {
        return this.porcentajeCumplimiento < porcentaje
    }

    sePuedeCumplir(): boolean {
        return this.porcentajeCumplimiento < 100 && this.estaAsignada()
    }

    cumplir() {
        this.porcentajeCumplimiento = 100
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

    sePuedeAsignar() {
        return this.estaCumplida()
    }

    estaCumplida() {
        return this.porcentajeCumplimiento != 100
    }
    
    estaAsignada() {
        return this.asignatario != null
    }

    static fromJson(tareaJSON) {
        return new Tarea(tareaJSON.id, tareaJSON.descripcion, tareaJSON.iteracion,
            Usuario.fromJSON(tareaJSON.asignadoA), tareaJSON.fecha, tareaJSON.porcentajeCumplimiento)
    }

    toJSON(): any {
        const result : any = Object.assign({}, this)
        result.asignatario = null 
        result.asignadoA = this.asignatario ? this.asignatario.nombre : ''
        return result
    }

}
```

## Servicios

Vamos a disparar pedidos a nuestro server local de XTRest ubicado en el puerto 9000. Pero no queremos repetir el mismo _endpoint_ en todos los lugares, entonces creamos un archivo _configuration.ts_ en el directorio services y exportamos una constante:

```typescript
export const REST_SERVER_URL = 'http://localhost:9000'
```

Esa constante la vamos a utilizar en todas las llamadas de nuestros services.

### TareasService

¿Qué necesitamos hacer?

- traer todas las tareas en la página principal (método GET)
- actualizar una tarea, tanto al cumplirla como en la asignación/desasignación (termina siendo un método PUT)
- y traer una tarea específica, esto será útil en la asignación, para mostrar los datos de la tarea que estamos asignando

Veamos cómo es la definición de TareasService:

```typescript
@Injectable({
  providedIn: 'root'
})
export class TareasService {

  constructor(private http: Http) { }

  todasLasTareas() {
    return this.http.get(REST_SERVER_URL + "/tareas").pipe(map(this.convertToTareas))
  }
```

- le inyectamos el objeto http que es quien nos permite hacer pedidos GET, POST, PUT y DELETE siguiendo las convenciones REST. Para eso debemos importar la clase Http de "@angular/http" (vean el código del service para más detalles)
- **@Injectable**: indica que nuestro service participa de la inyección de dependencias, y cualquiera que en su constructor escriba "tareasService" recibirá un objeto TareasService que además tendrá inyectado un objeto http (por ejemplo _tareas.component.ts_). La configuración providedIn: 'root' indica que el service _Singleton_ será inyectado por el NgModule sin necesidad de explícitamente definirlo en el archivo _app.module.ts_, según se explica [en esta página](https://www.uno-de-piera.com/di-angular-6-providedin/). 

Para traer todas las tareas, disparamos un pedido asincrónico al servidor: "http://localhost:9000/tareas". Eso no devuelve una lista de tareas: veamos cuál es la interfaz del método get en Http:

```javascript 
(method) Http.get(url: string, options?: RequestOptionsArgs): Observable<Response>
```

Devuelve la "promesa" de que cuando termine la operación recibiremos el resultado, en este caso la lista de Tareas en formato JSON. Para ello estaremos siendo observadores de la respuesta y seremos notificados cuando el server responda.

Angular 6 utiliza Reactive Javascript (RxJs) para encademnar varias operaciones asincrónicas de una manera simple, mediante la técnica de [**piping**](https://github.com/ReactiveX/rxjs/blob/91088dae1df097be2370c73300ffa11b27fd0100/doc/pipeable-operators.md), similar a la que probablemente conozcas si utilizaste Linux en algún momento:

```bash
$ ps -fe | grep chrome   # busca los procesos asociados con el navegador Google Chrome
```

En este caso, el output del primer comando (`ps -fe` que devuelve los procesos activos en el sistema operativo) sirve como input para el segundo comando(`grep chrome` que busca la palabra chrome dentro del _stream_).

Volviendo a la función map dentro del pipe:

```typescript
....pipe(map(this.convertToTareas))
```

El map se importa de Reactive Javascript, y es una función que dice cómo debemos trabajar la respuesta del server. Veamos cómo se implementa la función convertToTareas dentro del service 

```typescript
  private convertToTareas(res: Response) {
    return res.json().map(tareaJson => Tarea.fromJson(tareaJson))
  }
```

Este map no es el mismo que el que utiliza pipe, pero su objetivo es similar: transforma una lista de jsons en una lista de tareas.

Recibimos un _response_ como input, y devolvemos la lista de tareas convertida. Esta función se ejecutará solo cuando el backend conteste la lista de tareas, por lo tanto **lo que devuelve el service no es la lista de tareas, sino un observable de una lista de tareas**. En el componente llamamos al service, y a ese observable le definimos un _callback_, una función que sirve como observer. Si la operación termina bien, tendremos la lista de tareas en la variable _tareas_ correspondiente:

```typescript
  ngOnInit() {
    ....
    
    this.tareasService.todasLasTareas().subscribe(
      data => this.tareas = data,
      error => this.errors.push(error)
    )
  }
```
_tareas.component.ts_

Del mismo modo el service define los métodos para leer una tarea por id y para actualizar, como vemos a continuación:

```typescript
  getTareaById(id: number) {
    return this.http.get(REST_SERVER_URL + "/tareas/" + id).pipe(map(res => this.tareaAsJson(res.json())))
  }

  actualizarTarea(tarea: Tarea) {
    this.http.put(REST_SERVER_URL + "/tareas/" + tarea.id, tarea.toJSON()).subscribe()
  }

  private tareaAsJson(tareaJSON) : Tarea {
    return Tarea.fromJson(tareaJSON)
  }
```

El lector podrá advertir que el método actualizarTarea no tiene 

- un callback para procesar el resultado (por ejemplo para avisar al usuario que la operación se completó exitosamente)
- un callback para el tratamiento de los errores

Le dejamos la tarea para que la realice.

### UsuarioService

El service de usuarios sirve para traer la lista de usuarios en el combo de la página de asignación. También le inyectaremos el objeto http para hacer el pedido al backend.

```typescript
@Injectable({
  providedIn: 'root'
})
export class UsuariosService{

  constructor(private http: Http){}

  usuariosPosibles() {
    return this.http.get(REST_SERVER_URL + "/usuarios").pipe(map(this.extractData))
  }

  private extractData(res: Response) {
    return res.json().map(usuarioJson => new Usuario(usuarioJson.nombre))
  }
  
}
```

## Casos de uso

### Lista de Tareas

### Asignación de una persona a una tarea

## Pipes

# Testing

TODO
