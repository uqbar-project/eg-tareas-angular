import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { FilterTareas } from '../../pipes/filterTareas.pipe'
import { juana, StubTareasService, StubUsuariosService } from '../../services/stubs.service'
import { TareasService } from '../../services/tareas.service'
import { UsuariosService } from '../../services/usuarios.service'
import { AsignarComponent } from './asignar.component'
import { Tarea } from 'src/domain/tarea'
import { AppRoutingModule, routingComponents } from 'src/app/app-routing.module'

// routing
// componentes propios

const updatedTaskId = 1

describe('AsignarComponent', async () => {
  let component: AsignarComponent
  let fixture: ComponentFixture<AsignarComponent>
  let routerSpy: jasmine.SpyObj<Router>
  let stubTareasService: StubTareasService

  beforeEach((async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    stubTareasService = new StubTareasService()

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
        FontAwesomeModule
      ],
      providers: [
        UsuariosService,
        TareasService,
      ]
    })
      .compileComponents()

    TestBed.overrideComponent(AsignarComponent, {
      set: {
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                params: { 'id': updatedTaskId },
              }
            }
          },
          { provide: TareasService, useValue: stubTareasService },
          { provide: UsuariosService, useClass: StubUsuariosService },
          { provide: Router, useValue: routerSpy }
        ]
      }
    })

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
    expect(component.asignatario).toEqual(juana)
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
    expect(resultHtml.querySelector('[data-testid=tareaDescripcion]').textContent).toBe('Tarea 1')
  })

  it('assignment should take effect', fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement
    component.asignatario = component.usuariosPosibles[1]
    compiled.querySelector('[data-testid="guardar"]').click()
    fixture.whenStable().then(async () => {
      const updatedTask = await stubTareasService.getTareaById(updatedTaskId) as Tarea
      expect(updatedTask.asignatario?.nombre).toBe('John Doe')
    })
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
