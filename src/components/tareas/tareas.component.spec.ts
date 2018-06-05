import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { DebugElement } from '@angular/core'

import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'

// Font Awesome para los íconos
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserCheck, faUserMinus, faCalendarCheck, faTasks } from '@fortawesome/free-solid-svg-icons'

library.add(faUserCheck, faUserMinus, faCalendarCheck, faTasks)
//

/** Registramos el locale ES para formatear números */
import { registerLocaleData, APP_BASE_HREF } from '@angular/common'
import localeEs from '@angular/common/locales/es'

registerLocaleData(localeEs)
//

// routing
import { AppRoutingModule, routingComponents } from '../../app/app-routing.module'

// componentes propios
import { TareasComponent } from './tareas.component'
import { TareasService } from '../../services/tareas.service'
import { FilterTareas } from '../../pipes/filterTareas.pipe'
import { StubTareasService } from '../../services/stubs.service'

describe('TareasComponent', () => {
  let component: TareasComponent
  let fixture: ComponentFixture<TareasComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FilterTareas,
        routingComponents
      ],
      imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        FontAwesomeModule
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
      .compileComponents()

    TestBed.overrideComponent(TareasComponent, {
      set: {
        providers: [
          { provide: TareasService, useClass: StubTareasService }
        ]
      }
    })

    fixture = TestBed.createComponent(TareasComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should show 2 pending tasks', () => {
    fixture.detectChanges()
    expect(2).toBe(component.tareas.length)
  })

  it('first task could be mark as done', () => {
    fixture.detectChanges()
    const resultHtml = fixture.debugElement.nativeElement
    expect(resultHtml.querySelector('#cumplir_1')).toBeTruthy()
  })

  it('mark first task as done', () => {
    fixture.detectChanges()
    const resultHtml = fixture.debugElement.nativeElement
    resultHtml.querySelector('#cumplir_1').click()
    fixture.detectChanges()
    expect(resultHtml.querySelector('#porcentaje_1').textContent).toBe("100,00")
  })

  it('unassign first task', () => {
    fixture.detectChanges()
    const resultHtml = fixture.debugElement.nativeElement
    resultHtml.querySelector('#desasignar_1').click()
    fixture.detectChanges()
    expect(resultHtml.querySelector('#asignatario_1').textContent).toBe("")
  })

  it('searching for second task should have one tr in tasks list', () => {
    component.tareaBuscada = "2"
    fixture.detectChanges()
    const resultHtml = fixture.debugElement.nativeElement
    expect(resultHtml.querySelectorAll('.animate-repeat').length).toBe(1)
  })

})
