
# Tareas de un equipo de desarrollo

TODO: Build de travis

TODO Demo

Este ejemplo se basa en el seguimiento de tareas de un equipo de desarrollo y permite mostrar una aplicación completa en Angular con los siguientes conceptos

- **routing** de páginas master / detail de tareas
- utilización de Bootstrap 4 como framework de CSS + Font Awesome para los íconos
- desarrollo de front-end en Angular utilizando **servicios REST** desde el backend (por ejemplo, con XTRest)
- para lo cual es necesario la inyección del objeto **httpClient** dentro de los objetos service
- la **separación de concerns** entre las tareas como objeto de dominio, la vista html, el componente que sirve como modelo de vista y el servicio que maneja el origen de los datos
- el manejo del **asincronismo** para recibir parámetros en la ruta, así como para disparar actualizaciones y consultas hacia el backend
- de yapa, repasaremos el uso de **pipes built-in** para formatear decimales en los números y uno propio para realizar el filtro de tareas en base a un valor ingresado

# Preparación del proyecto

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

TODO

## Objetos de dominio

## Servicios

## Componentes

## Vistas

# Testing

TODO
