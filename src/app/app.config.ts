import { provideHttpClient } from '@angular/common/http'
import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Sin esto no hay ningun mecanismo que le avise a Angular que hay que
    // volver a renderizar: la app hace el request pero la pantalla queda en
    // blanco. Los tests no lo detectan porque detectChanges() fuerza el render.
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient()
  ]
}
