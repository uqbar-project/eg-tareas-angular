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
import { AngularMyDatePickerModule } from 'angular-mydatepicker'

@NgModule({
  declarations: [
    AppComponent,
    routingComponents, 
    FilterTareas, 
    OrderTareas,
    ValidationFieldComponent,
  ],
  imports: [
    AngularMyDatePickerModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    IconsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
