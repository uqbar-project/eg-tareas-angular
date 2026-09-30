import type { Mocked } from 'vitest'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NuevaTareaComponent } from './nueva-tarea.component'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { getHttpClientSpy } from 'testing/httpClientSpy'
import { stabilize } from 'testing/stabilize'
import { Usuario } from 'domain/usuario'

describe('NuevaTareaComponent', () => {
  let component: NuevaTareaComponent
  let fixture: ComponentFixture<NuevaTareaComponent>
  let routerSpy: Mocked<Pick<Router, 'navigate' | 'navigateByUrl'>>
  let httpClientSpy: ReturnType<typeof getHttpClientSpy>

  beforeEach(async () => {
    routerSpy = {
      navigate: vi.fn(),
      navigateByUrl: vi.fn()
    }
    httpClientSpy = getHttpClientSpy()

    await TestBed.configureTestingModule({
      imports: [NuevaTareaComponent],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(NuevaTareaComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should create a new task', async () => {
    // Arrange
    await sendInput('descripcion', 'Aprender Angular')
    await sendInput('iteracion', 'Iteracion 1')
    // TODO: lograr que funcione para input type date y drop down
    // puede ser que tenga que ver con el evento de HTML
    // await sendInput('fecha', '02/22/2020')
    component.tarea.fecha = new Date()
    component.asignatario = new Usuario('Nahuel Palumbo')
    await sendInput('porcentaje-cumplimiento', '20')

    // Act
    getByTestId('guardar').click()
    await stabilize(fixture)

    // Assert
    const route = routerSpy.navigateByUrl.mock.calls[0][0]
    expect(route).toBe('/')
  })

  it('an invalid task cannot be created', async () => {
    await sendInput('porcentaje-cumplimiento', '101')
    getByTestId('guardar').click()
    await stabilize(fixture)
    expect(routerSpy.navigateByUrl).toHaveBeenCalledTimes(0)
    expect(component.tarea.hasErrors).toBeTruthy()
    expect(component.tarea.errors.length).toBe(4)
    validateErrorField('descripcion')
    validateErrorField('iteracion')
    validateErrorField('fecha')
    validateErrorField('porcentajeCumplimiento')
  })

  function getByTestId(testId: string) {
    const resultHtml = fixture.debugElement.nativeElement
    return resultHtml.querySelector(`[data-testid="${testId}"`)
  }

  async function sendInput(testId: string, text: string) {
    const inputElement = getByTestId(testId)
    inputElement.value = text
    inputElement.dispatchEvent(new Event('input'))
    return stabilize(fixture)
  }

  function validateErrorField(field: string) {
    expect(getByTestId(`error-message-${field}`).innerHTML).toBeTruthy()
  }
})
