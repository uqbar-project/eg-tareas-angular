//
/** Registramos el locale ES para formatear números */
import { registerLocaleData } from '@angular/common'
import localeEs from '@angular/common/locales/es'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { AppRoutingModule, routingComponents } from '../../app/app-routing.module'
import { IconsModule } from '../../app/icons.module'
import { FilterTareas } from '../../pipes/filterTareas.pipe'
import { OrderTareas } from '../../pipes/orderTareas.pipe'
import { StubTareasService } from '../../services/stubs.service'
import { TareasService } from '../../services/tareas.service'
import { TareasComponent } from './tareas.component'

// Font Awesome para los íconos
//
// routing
// componentes propios

registerLocaleData(localeEs)


describe('TareasComponent', () => {
  let component: TareasComponent
  let fixture: ComponentFixture<TareasComponent>

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [FilterTareas, OrderTareas, routingComponents],
      imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        FontAwesomeModule,
        IconsModule,
      ],
    }).compileComponents()

    TestBed.overrideComponent(TareasComponent, {
      set: {
        providers: [
          { provide: TareasService, useClass: StubTareasService }
        ]
      }
    })

    fixture = TestBed.createComponent(TareasComponent)
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initially show 2 pending tasks', async () => {
    expect(2).toBe(component.tareas.length)
  })

  it('first task can be marked as done', async () => {
    const resultHtml = fixture.debugElement.nativeElement
    expect(resultHtml.querySelector('[data-testid="cumplir_1"]')).toBeTruthy()
  })

  it('when a task is done, it has 100% of completion', async () => {
    const resultHtml = fixture.debugElement.nativeElement
    resultHtml.querySelector('[data-testid="cumplir_1"]').click()
    fixture.detectChanges()
    expect(resultHtml.querySelector('[data-testid="porcentaje_1"]').textContent).toBe('100,00')
  })

  it('unassign first task', async () => {
    const resultHtml = fixture.debugElement.nativeElement
    resultHtml.querySelector('[data-testid="desasignar_1"]').click()
    fixture.detectChanges()
    expect(resultHtml.querySelector('[data-testid="asignatario_1"]').textContent).toBe('')
  })

  it('searching for second task should have one tr in tasks list', async () => {
    component.tareaBuscada = '2'
    fixture.detectChanges()
    const resultHtml = fixture.debugElement.nativeElement
    expect(resultHtml.querySelectorAll('[data-testid="fila-tarea"]').length).toBe(1)
  })

})
