import '@angular/common/locales/global/es'
import { bootstrapApplication } from '@angular/platform-browser'
import { appConfig } from './app/app.config'
import { AppComponent } from './app/app.component'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err))

dayjs.extend(customParseFormat)