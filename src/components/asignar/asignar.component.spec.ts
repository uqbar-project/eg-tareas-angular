import { APP_BASE_HREF } from '@angular/common'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { AppRoutingModule, routingComponents } from '../../app/app-routing.module'
import { FilterTareas } from '../../pipes/filterTareas.pipe'
import { juana, StubTareasService, StubUsuariosService } from '../../services/stubs.service'
import { TareasService } from '../../services/tareas.service'
import { UsuariosService } from '../../services/usuarios.service'
import { AsignarComponent } from './asignar.component'

// routing
// componentes propios


describe('AsignarComponent', async () => {
  let component: AsignarComponent
  let fixture: ComponentFixture<AsignarComponent>

  beforeEach((async () => {
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
      providers: [UsuariosService, TareasService,
        { provide: APP_BASE_HREF, useValue: '/' }]
    })
      .compileComponents()

    TestBed.overrideComponent(AsignarComponent, {
      set: {
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                params: { 'id': 1 },
              }
            }
          },
          { provide: TareasService, useClass: StubTareasService },
          { provide: UsuariosService, useClass: StubUsuariosService }
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
    component.asignatario = null
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

})
