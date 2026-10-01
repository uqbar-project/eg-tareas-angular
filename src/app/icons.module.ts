import { NgModule } from '@angular/core'
import {
  FaIconLibrary,
  FontAwesomeModule
} from '@fortawesome/angular-fontawesome'
import {
  faCalendarCheck,
  faTasks,
  faUserCheck,
  faUserMinus
} from '@fortawesome/free-solid-svg-icons'

@NgModule({
  imports: [FontAwesomeModule],
  exports: [FontAwesomeModule]
})
export class IconsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faUserCheck, faUserMinus, faCalendarCheck, faTasks)
  }
}
