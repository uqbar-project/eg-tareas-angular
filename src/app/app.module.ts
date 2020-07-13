import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { AppRoutingModule, routingComponents } from './app-routing.module'
import { AppComponent } from './app.component'
import { FilterTareas } from '../pipes/filterTareas.pipe'
import { HttpClientModule } from '@angular/common/http'

import { IconsModule } from "./icons.module";
import '@angular/common/locales/global/es'


@NgModule({
  declarations: [AppComponent, routingComponents, FilterTareas],
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
export class AppModule {}
