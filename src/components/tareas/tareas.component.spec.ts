//
/** Registramos el locale ES para formatear números */
import { registerLocaleData } from '@angular/common'
import localeEs from '@angular/common/locales/es'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { AppRoutingModule, routingComponents } from 'src/app/app-routing.module'

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
  let routerSpy: jasmine.SpyObj<Router>

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl'])

    TestBed.configureTestingModule({
      declarations: [
        FilterTareas,
        OrderTareas,
        routingComponents
      ],
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
          { provide: TareasService, useClass: StubTareasService },
          { provide: Router, useValue: routerSpy }
        ]
      }
    })

    fixture = TestBed.createComponent(TareasComponent)
    // Estas tres líneas activan el envío de mensajes necesario
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initially show 2 pending tasks', () => {
    expect(2).toBe(component.tareas.length)
  })

  it('first task can be marked as done', () => {
    expect(getByTestId('cumplir_1')).toBeTruthy()
  })

  it('when a task is done, it has 100% of completion', () => {
    getByTestId('cumplir_1').click()
    fixture.detectChanges()
    expect(getByTestId('porcentaje_1').textContent).toBe('100,00')
  })

  it('unassign first task', async () => {
    getByTestId('desasignar_1').click()
    fixture.detectChanges()
    expect(getByTestId('asignatario_1').textContent).toBe('')
  })

  it('searching for second task should have one tr in tasks list', () => {
    component.tareaBuscada = '2'
    fixture.detectChanges()
    const resultHtml = fixture.debugElement.nativeElement
    expect(resultHtml.querySelectorAll('[data-testid="fila-tarea"]').length).toBe(1)
  })

  it('unassign - should catch error gracefully', async () => {
    spyOn(component.tareasService , 'actualizarTarea').and.callFake(() => {
      throw new Error('Fake error')
    })
    getByTestId('desasignar_1').click()
    fixture.detectChanges()
    await fixture.whenStable()
    // es necesario hacer este paso adicional para poder validar los errores
    fixture.detectChanges()
    expect(getByTestId('error-message').innerHTML).not.toBeFalsy()
  })

  it('finish - should catch error gracefully', async () => {
    spyOn(component.tareasService , 'actualizarTarea').and.callFake(() => {
      throw new Error('Fake error')
    })
    getByTestId('cumplir_1').click()
    fixture.detectChanges()
    await fixture.whenStable()
    // es necesario hacer este paso adicional para poder validar los errores
    fixture.detectChanges()
    expect(getByTestId('error-message').innerHTML).not.toBeFalsy()
  })

  it('create new task should navigate', async () => {
    getByTestId('nueva-tarea').click()
    
    fixture.detectChanges()

    const route = routerSpy.navigateByUrl.calls.first().args[0]
    expect(route).toBe('/nuevaTarea')
  })

  it('assign task should navigate', () => {
    getByTestId('asignar_2').click()
    
    fixture.detectChanges()

    const route = routerSpy.navigate.calls.first().args[0]
    expect(route).toEqual(['/asignarTarea', 2])
  })

  function getByTestId(testId: string) {
    const resultHtml = fixture.debugElement.nativeElement
    return resultHtml.querySelector(`[data-testid="${testId}"]`)
  }
})
