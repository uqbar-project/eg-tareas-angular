import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { AppRoutingModule, routingComponents } from './app-routing.module'
import { AppComponent } from './app.component'
import { FilterTareas } from '../pipes/filterTareas.pipe'
import { HttpModule } from '@angular/http'

// Font Awesome para los íconos
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserCheck, faUserMinus, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'


library.add(faUserCheck, faUserMinus, faCalendarCheck)
//

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

export class AppModule { }
