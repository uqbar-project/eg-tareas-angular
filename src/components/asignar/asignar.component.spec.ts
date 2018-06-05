import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

// routing
import { AppRoutingModule, routingComponents } from '../../app/app-routing.module'
import { APP_BASE_HREF } from '@angular/common'
import { ActivatedRoute, Data } from '@angular/router'

// componentes propios
import { AsignarComponent } from './asignar.component'
import { UsuariosService } from '../../services/usuarios.service'
import { TareasService } from '../../services/tareas.service'
import { StubUsuariosService, StubTareasService, juana } from '../../services/stubs.service'
import { FilterTareas } from '../../pipes/filterTareas.pipe'

describe('AsignarComponent', () => {
  let component: AsignarComponent
  let fixture: ComponentFixture<AsignarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        AsignarComponent,
        routingComponents,
        FilterTareas
      ],
      imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        FontAwesomeModule
      ],
      providers: [UsuariosService, TareasService,
        {provide: APP_BASE_HREF, useValue : '/' }]
    })
    .compileComponents()

    TestBed.overrideComponent(AsignarComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute,
            useValue: {
              params: {
                subscribe: (fn: (value: Data) => void) => fn({
                  id: 1
                })
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
    resultHtml.querySelector('#guardar').click()
    fixture.detectChanges()
    expect(component.asignatario).toBeFalsy()
  })

  it('task label', () => {
    fixture.detectChanges()
    const resultHtml = fixture.debugElement.nativeElement
    expect(resultHtml.querySelector('#tareaDescripcion').textContent).toBe('Tarea 1')
  })

})
