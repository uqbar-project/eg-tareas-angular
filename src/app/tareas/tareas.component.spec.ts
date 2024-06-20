import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick
} from '@angular/core/testing'

import { TareasComponent } from './tareas.component'
import { getHttpClientSpy } from 'services/httpClientSpy'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { registerLocaleData } from '@angular/common'
import localeEs from '@angular/common/locales/es'
import { throwError } from 'rxjs'

//
/** Registramos el locale ES para formatear números */
// Font Awesome para los íconos
//
// routing
// componentes propios

registerLocaleData(localeEs)

describe('TareasComponent', () => {
  let component: TareasComponent
  let fixture: ComponentFixture<TareasComponent>
  let routerSpy: jasmine.SpyObj<Router>
  let httpClientSpy: jasmine.SpyObj<HttpClient>

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl'])
    httpClientSpy = getHttpClientSpy()

    await TestBed.configureTestingModule({
      imports: [TareasComponent],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(TareasComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    await fixture.whenStable()
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initially show 2 pending tasks', fakeAsync(() => {
    expect(2).toBe(component.tareas.length)
  }))

  it('first task can be marked as done', () => {
    expect(getByTestId('cumplir_1')).toBeTruthy()
  })

  it('when a task is done, it has 100% of completion', () => {
    getByTestId('cumplir_1').click()
    fixture.detectChanges()
    // Chequeamos que el objeto de dominio tarea responde correctamente,
    // pero también el binding entre componente y vista
    expect(getByTestId('porcentaje_1').textContent).toBe('100,00')
    // https://daveceddia.com/jasmine-2-spy-cheat-sheet/
    // Chequeamos que se haya enviado la información correctamente al backend
    const tareaActualizada = httpClientSpy.put.calls.mostRecent().args[1]
    expect(tareaActualizada.porcentajeCumplimiento).toBe(100)
  })

  it('unassign first task', async () => {
    getByTestId('desasignar_1').click()
    fixture.detectChanges()
    expect(getByTestId('asignatario_1').textContent).toBe('')
  })

  it('searching for second task should have one tr in tasks list', () => {
    component.tareaBuscada = 'e2e'
    fixture.detectChanges()
    const resultHtml = fixture.debugElement.nativeElement
    expect(
      resultHtml.querySelectorAll('[data-testid="fila-tarea"]').length
    ).toBe(1)
  })

  it('unassign - should catch error gracefully', fakeAsync(() => {
    httpClientSpy.put.and.returnValue(throwError(() => new Error('Fake error')))

    getByTestId('desasignar_1').click()
    tick(1000)
    fixture.detectChanges()

    expect(getByTestId('error-message')?.innerHTML).toBeTruthy()
    // Importante para que no falle con "Error: 1 timer(s) still in the queue"
    // tick(2000)
    // o mejor...
    flush()

    httpClientSpy.put.calls.reset()
  }))

  it('finish - should catch error gracefully', fakeAsync(() => {
    httpClientSpy.put.and.returnValue(throwError(() => new Error('Fake error')))

    getByTestId('cumplir_1').click()
    tick(1000)
    fixture.detectChanges()
    expect(getByTestId('error-message')?.innerHTML).toBeTruthy()
    flush()

    httpClientSpy.put.calls.reset()
  }))

  it('create new task should navigate', async () => {
    getByTestId('nueva-tarea').click()

    fixture.detectChanges()

    const route = routerSpy.navigateByUrl.calls.first().args[0]
    expect(route).toBe('/nuevaTarea')
  })

  it('assign task should navigate', () => {
    getByTestId('asignar_2').click()

    fixture.detectChanges()

    // const route = routerSpy.navigate.calls.first().args[0]
    // expect(route).toEqual(['/asignarTarea', 2])

    // Con destructuring
    const [url, tareaId] = routerSpy.navigate.calls.first().args[0]
    expect(url).toBe('/asignarTarea')
    expect(tareaId).toBe(2)
  })

  function getByTestId(testId: string) {
    const resultHtml = fixture.debugElement.nativeElement
    return resultHtml.querySelector(`[data-testid="${testId}"]`)
  }
})
