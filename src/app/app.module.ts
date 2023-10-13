import '@angular/common/locales/global/es'

import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'

import { FilterTareas } from '../pipes/filterTareas.pipe'
import { OrderTareas } from '../pipes/orderTareas.pipe'
import { AppRoutingModule, routingComponents } from './app-routing.module'
import { AppComponent } from './app.component'
import { IconsModule } from './icons.module'
import { ValidationFieldComponent } from './../components/validationField/validationField.component'
import { DpDatePickerModule } from 'ng2-date-picker'
import { TareasRestService } from 'src/services/tareas.rest.service'
import { TareasService } from 'src/services/tareas.service'
import { TareasMockService } from 'src/services/tareas.mock.service'
import { UsuariosRestService } from 'src/services/usuarios.rest.service'
import { UsuariosService } from 'src/services/usuarios.service'
import { UsuariosMockService } from 'src/services/ususarios.mock.service'

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    FilterTareas,
    OrderTareas,
    ValidationFieldComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    IconsModule,
    DpDatePickerModule
  ],
  providers: [
    {
      provide: TareasService,
      // useClass: TareasRestService
      useClass: TareasMockService
    },
    {
      provide: UsuariosService,
      // useClass: UsuariosRestService
      useClass: UsuariosMockService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
