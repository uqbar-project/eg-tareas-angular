/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { AppRoutingModule, routingComponents } from 'src/app/app-routing.module'
import { httpClientSpy, tareaPrincipal } from 'src/services/httpClientSpy'

import { FilterTareas } from '../../pipes/filterTareas.pipe'
import { usuarioAsignatario } from './../../services/httpClientSpy'
import { AsignarComponent } from './asignar.component'
import { UsuariosService } from 'src/services/usuarios.service'
import { UsuariosMockService } from 'src/services/ususarios.mock.service'
import { TareasMockService } from 'src/services/tareas.mock.service'
import { TareasService } from 'src/services/tareas.service'

const updatedTaskId = 1

describe('AsignarComponent', async () => {
  let component: AsignarComponent
  let fixture: ComponentFixture<AsignarComponent>
  let routerSpy: jasmine.SpyObj<Router>

  beforeEach((async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate'])

    TestBed.configureTestingModule({
      declarations: [
        AsignarComponent,
        routingComponents,
        FilterTareas
      ],
      imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        FontAwesomeModule,
        HttpClientModule,
      ],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { 'id': updatedTaskId },
            }
          }
        },
        { provide: Router, useValue: routerSpy },
        { provide: UsuariosService, useClass: UsuariosMockService},
        { provide: TareasService, useClass: TareasMockService}
      ]
    })
      .compileComponents()

    fixture = TestBed.createComponent(AsignarComponent)
    component = fixture.componentInstance
    await component.initialize()
  }))

  it('should create', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('should show task assigned used first', () => {
    fixture.detectChanges()
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
    expect(resultHtml.querySelector('[data-testid=tareaDescripcion]').textContent).toBe(tareaPrincipal.descripcion)
  })

  it('assignment should take effect', (async () => {
    const compiled = fixture.debugElement.nativeElement
    const nuevoAsignatario = component.usuariosPosibles[0]
    component.asignatario = nuevoAsignatario
    compiled.querySelector('[data-testid="guardar"]').click()
    await fixture.whenStable()

    // Queremos saber que en algún momento se haya pedido al backend que se asigne a otro usuarie
    const tareaDesasignada = { ...tareaPrincipal.toJSON(), asignadoA: nuevoAsignatario.nombre }
    expect(httpClientSpy.put).toHaveBeenCalledWith(`http://localhost:9000/tareas/${tareaPrincipal.id}`, tareaDesasignada)
  }))

  it('should navigate back to home when form submitted', fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement
    compiled.querySelector('[data-testid="guardar"]').click()
    fixture.whenStable().then(() => {
      const [route] = routerSpy.navigate.calls.first().args[0]
      expect(route).toBe('/tareas')
    })
  }))

  it('should navigate back to home when close clicked', fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement
    compiled.querySelector('[data-testid="cerrar"]').click()
    fixture.whenStable().then(() => {
      const [route] = routerSpy.navigate.calls.first().args[0]
      expect(route).toBe('/tareas')
    })
  }))

})
