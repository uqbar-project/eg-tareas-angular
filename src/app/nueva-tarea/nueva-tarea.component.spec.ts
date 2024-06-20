import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NuevaTareaComponent } from './nueva-tarea.component'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { getHttpClientSpy } from 'services/httpClientSpy'
import { Usuario } from 'domain/usuario'

describe('NuevaTareaComponent', () => {
  let component: NuevaTareaComponent
  let fixture: ComponentFixture<NuevaTareaComponent>
  let routerSpy: jasmine.SpyObj<Router>
  let httpClientSpy: jasmine.SpyObj<HttpClient>

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl'])
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
    component.tarea.fecha = new Date()
    component.asignatario = new Usuario('Nahuel Palumbo')
    await sendInput('porcentaje-cumplimiento', '20')

    // Act
    getByTestId('guardar').click()
    fixture.detectChanges()
    await fixture.whenStable()

    // Assert
    const route = routerSpy.navigateByUrl.calls.first().args[0]
    expect(route).toBe('/')
  })

  it('an invalid task cannot be created', async () => {
    await sendInput('porcentaje-cumplimiento', '101')
    getByTestId('guardar').click()
    fixture.detectChanges()
    await fixture.whenStable()
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

  async function sendInput(testId: string, text: string | Date) {
    const inputElement = getByTestId(testId)
    inputElement.value = text
    inputElement.dispatchEvent(new Event('input'))
    fixture.detectChanges()
    return fixture.whenStable()
  }

  function validateErrorField(field: string) {
    expect(getByTestId(`error-message-${field}`).innerHTML).toBeTruthy()
  }
})
