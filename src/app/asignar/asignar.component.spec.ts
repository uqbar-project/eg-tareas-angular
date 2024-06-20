import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AsignarComponent } from './asignar.component'
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import {
  getHttpClientSpy,
  tareaPrincipal,
  usuarioAsignatario
} from 'services/httpClientSpy'

const updatedTaskId = 1

describe('AsignarComponent', () => {
  let component: AsignarComponent
  let fixture: ComponentFixture<AsignarComponent>
  let routerSpy: jasmine.SpyObj<Router>
  let httpClientSpy: jasmine.SpyObj<HttpClient>

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    httpClientSpy = getHttpClientSpy()

    await TestBed.configureTestingModule({
      imports: [AsignarComponent],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: updatedTaskId }
            }
          }
        },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(AsignarComponent)
    component = fixture.componentInstance
    await component.initialize()
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should show task assigned used first', () => {
    expect(component.asignatario).toEqual(usuarioAsignatario)
  })

  it('task unassigment', () => {
    component.asignatario = undefined
    const resultHtml = fixture.debugElement.nativeElement
    resultHtml.querySelector('[data-testid="guardar"]').click()
    fixture.detectChanges()
    expect(component.asignatario).toBeFalsy()
  })

  it('task label', () => {
    fixture.detectChanges()
    const resultHtml = fixture.debugElement.nativeElement
    expect(
      resultHtml.querySelector('[data-testid=tareaDescripcion]').textContent
    ).toBe(tareaPrincipal.descripcion)
  })

  it('assignment should take effect', () => {
    const compiled = fixture.debugElement.nativeElement
    const nuevoAsignatario = component.usuariosPosibles[0]
    component.asignatario = nuevoAsignatario
    compiled.querySelector('[data-testid="guardar"]').click()

    // Queremos saber que en algún momento se haya pedido al backend que se asigne a otro usuarie
    const tareaAsignada = {
      ...tareaPrincipal.toJSON(),
      asignadoA: nuevoAsignatario.nombre
    }
    expect(httpClientSpy.put).toHaveBeenCalledWith(
      `http://localhost:9000/tareas/${tareaPrincipal.id}`,
      tareaAsignada
    )
  })

  it('should navigate back to home when form submitted', async () => {
    const compiled = fixture.debugElement.nativeElement
    compiled.querySelector('[data-testid="guardar"]').click()
    await fixture.whenStable()

    const [route] = routerSpy.navigate.calls.first().args[0]
    expect(route).toBe('/tareas')
  })

  it('should navigate back to home when close clicked', async () => {
    const compiled = fixture.debugElement.nativeElement
    compiled.querySelector('[data-testid="cerrar"]').click()
    await fixture.whenStable()
    const [route] = routerSpy.navigate.calls.first().args[0]
    expect(route).toBe('/tareas')
  })
})
