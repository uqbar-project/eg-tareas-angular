import { provideHttpClient } from '@angular/common/http'
import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core'
import { provideRouter } from '@angular/router'
import { routes } from './app.routes'
import { provideIcons } from './icons'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideIcons()
  ]
}
