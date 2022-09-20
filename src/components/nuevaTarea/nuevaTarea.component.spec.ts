import { ValidationFieldComponent } from './../validationField/validationField.component'
import { AngularMyDatePickerModule } from 'angular-mydatepicker'
import { Router } from '@angular/router'
import { TareasService } from './../../services/tareas.service'
import { UsuariosService } from './../../services/usuarios.service'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { StubTareasService, StubUsuariosService } from './../../services/stubs.service'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NuevaTareaComponent } from './nuevaTarea.component'
import { Usuario } from 'src/domain/usuario'

describe('NuevaTareaComponent', () => {
  let component: NuevaTareaComponent
  let fixture: ComponentFixture<NuevaTareaComponent>
  let routerSpy: jasmine.SpyObj<Router>

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl'])

    TestBed.configureTestingModule({
      declarations: [ 
        NuevaTareaComponent,
        ValidationFieldComponent,
      ],
      imports: [
        AngularMyDatePickerModule,
        BrowserModule,
        FormsModule,
        FontAwesomeModule,
      ],
      providers: [
        UsuariosService,
        TareasService,
      ]
    })
    .compileComponents()

    TestBed.overrideComponent(NuevaTareaComponent, {
      set: {
        providers: [
          { provide: TareasService, useClass: StubTareasService },
          { provide: UsuariosService, useClass: StubUsuariosService },
          { provide: Router, useValue: routerSpy }
        ]
      }
    })
  })

  beforeEach(async () => {
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
    component.asignatario = new Usuario('Nahuel Palumbo')
    await sendInput('fecha', '20/02/2020')
    component.fechaSeleccionada({
      singleDate: {
        jsDate: new Date(),
      },
      isRange: false,
    })
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

  async function sendInput(testId: string, text: string) {
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
