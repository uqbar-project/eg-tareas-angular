import {
  type EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer
} from '@angular/core'
import { FaIconLibrary } from '@fortawesome/angular-fontawesome'
import {
  faCalendarCheck,
  faTasks,
  faUserCheck,
  faUserMinus
} from '@fortawesome/free-solid-svg-icons'

/**
 * Registra los íconos de Font Awesome que usa la app.
 *
 * Reemplaza al antiguo IconsModule: en vez de un NgModule que suma los íconos en
 * el constructor, los registramos con un app initializer, que corre una sola vez
 * al bootstrap. Así FontAwesomeModule se importa únicamente donde se usan
 * etiquetas <fa-icon>, no en un módulo aparte.
 */
export function provideIcons(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      inject(FaIconLibrary).addIcons(
        faUserCheck,
        faUserMinus,
        faCalendarCheck,
        faTasks
      )
    })
  ])
}
