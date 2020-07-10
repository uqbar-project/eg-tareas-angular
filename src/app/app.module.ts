import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { AppRoutingModule, routingComponents } from './app-routing.module'
import { AppComponent } from './app.component'
import { FilterTareas } from '../pipes/filterTareas.pipe'
import { HttpClientModule } from '@angular/common/http'

// Font Awesome para los íconos
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome'
import { faUserCheck, faUserMinus, faCalendarCheck, faTasks } from '@fortawesome/free-solid-svg-icons'
//

import '@angular/common/locales/global/es'


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    FilterTareas
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faUserCheck, faUserMinus, faCalendarCheck, faTasks)
  }
}
