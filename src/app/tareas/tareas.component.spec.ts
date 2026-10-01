import { registerLocaleData } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import localeEs from '@angular/common/locales/es'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { throwError } from 'rxjs'
import { getHttpClientSpy } from 'testing/httpClientSpy'
import { flushMicrotasks, stabilize } from 'testing/stabilize'
import type { Mocked } from 'vitest'
import { TareasComponent } from './tareas.component'

//
/** Registramos el locale ES para formatear números */
// Font Awesome para los íconos
//
// routing
// componentes propios

registerLocaleData(localeEs)

type RouterSpy = Mocked<Pick<Router, 'navigate' | 'navigateByUrl'>>

describe('TareasComponent', () => {
  let component: TareasComponent
  let fixture: ComponentFixture<TareasComponent>
  let routerSpy: RouterSpy
  let httpClientSpy: ReturnType<typeof getHttpClientSpy>

  beforeEach(async () => {
    routerSpy = {
      navigate: vi.fn(),
      navigateByUrl: vi.fn()
    }
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

    // ngOnInit es async y en zoneless whenStable() no la espera
    await stabilize(fixture)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initially show 2 pending tasks', () => {
    expect(2).toBe(component.tareas().length)
  })

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
    const tareaActualizada = httpClientSpy.put.mock.lastCall![1]
    expect(tareaActualizada.porcentajeCumplimiento).toBe(100)
  })

  it('the chip changes color when the task is done', () => {
    // La pipe estadoCumplimiento es pura: si recibiera la Tarea, cumplir() la
    // muta en sitio y la referencia no cambia, asi que devolveria el valor
    // cacheado y el chip se quedaria con el color viejo. Por eso recibe el
    // porcentaje, que si cambia de valor.
    const chip = getByTestId('chip_1')
    expect(chip.className).toContain('chip-medio')

    getByTestId('cumplir_1').click()
    fixture.detectChanges()

    expect(getByTestId('porcentaje_1').textContent).toBe('100,00')
    expect(chip.className).toContain('chip-alto')
    expect(chip.className).not.toContain('chip-medio')
  })

  it('unassign first task', async () => {
    getByTestId('desasignar_1').click()
    fixture.detectChanges()
    // el avatar sin asignatario muestra '?', no el nombre
    expect(getByTestId('asignatario_1').textContent).toBe('?')
  })

  it('el avatar muestra las iniciales del asignatario', () => {
    const avatar = getByTestId('asignatario_1')
    expect(avatar.textContent?.trim()).toBe('GP')
    expect(avatar.className).toContain('avatar-')
    // sin avatar no puede ser el color de una persona
    expect(avatar.className).not.toContain('avatar-vacio')
  })

  it('searching for second task should have one tr in tasks list', async () => {
    // Editamos el input como lo haria el usuario: mutar el campo del componente
    // desincroniza el ngModel, que escribe el valor de forma asincrona.
    const searchInput = getByTestId('tareaBuscada') as HTMLInputElement
    searchInput.value = 'e2e'
    searchInput.dispatchEvent(new Event('input'))
    await stabilize(fixture)
    const resultHtml = fixture.debugElement.nativeElement
    expect(
      resultHtml.querySelectorAll('[data-testid="fila-tarea"]').length
    ).toBe(1)
  })

  it('unassign - should catch error gracefully', async () => {
    httpClientSpy.put.mockReturnValue(throwError(() => new Error('Fake error')))

    getByTestId('desasignar_1').click()
    // Ojo: sin whenStable() acá. El catch de actualizarTarea vuelve a pedir las
    // tareas antes de registrar el error, y el tick que dispara whenStable()
    // cae en medio de esa cadena y dispara NG0100.
    await flushMicrotasks()
    fixture.detectChanges()

    // mostrarError limpia los errores a los 5000ms con un setTimeout real, asi
    // que alcanza con comprobar que el mensaje se muestra.
    expect(getByTestId('error-message')?.innerHTML).toBeTruthy()
  })

  it('finish - should catch error gracefully', async () => {
    httpClientSpy.put.mockReturnValue(throwError(() => new Error('Fake error')))

    getByTestId('cumplir_1').click()
    // Ojo: sin whenStable() acá. El catch de actualizarTarea vuelve a pedir las
    // tareas antes de registrar el error, y el tick que dispara whenStable()
    // cae en medio de esa cadena y dispara NG0100.
    await flushMicrotasks()
    fixture.detectChanges()

    // mostrarError limpia los errores a los 5000ms con un setTimeout real, asi
    // que alcanza con comprobar que el mensaje se muestra.
    expect(getByTestId('error-message')?.innerHTML).toBeTruthy()
  })

  it('create new task should navigate', async () => {
    getByTestId('nueva-tarea').click()

    fixture.detectChanges()

    const route = routerSpy.navigateByUrl.mock.calls[0][0]
    expect(route).toBe('/nuevaTarea')
  })

  it('assign task should navigate', () => {
    getByTestId('asignar_2').click()

    fixture.detectChanges()

    // const route = routerSpy.navigate.calls.first().args[0]
    // expect(route).toEqual(['/asignarTarea', 2])

    // Con destructuring
    const [url, tareaId] = routerSpy.navigate.mock.calls[0][0]
    expect(url).toBe('/asignarTarea')
    expect(tareaId).toBe(2)
  })

  function getByTestId(testId: string) {
    const resultHtml = fixture.debugElement.nativeElement
    return resultHtml.querySelector(`[data-testid="${testId}"]`)
  }
})
