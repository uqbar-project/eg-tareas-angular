import { AppRoutingModule, routingComponents } from './app-routing.module'
import '@angular/common/locales/global/es'

import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { IconsModule } from './icons.module'
import { FilterTareas } from './pipes/filterTareas.pipe'
import { OrderTareas } from './pipes/orderTareas.pipe'


@NgModule({
  declarations: [AppComponent, routingComponents, FilterTareas, OrderTareas],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    IconsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
