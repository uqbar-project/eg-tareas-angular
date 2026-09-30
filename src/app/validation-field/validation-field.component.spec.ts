import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ValidationFieldComponent } from './validation-field.component'
import { tareaPrincipal } from 'testing/httpClientSpy'
import { Tarea } from 'domain/tarea'

describe('ValidationFieldComponent', () => {
  let component: ValidationFieldComponent
  let fixture: ComponentFixture<ValidationFieldComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationFieldComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(ValidationFieldComponent)
    component = fixture.componentInstance
    // En zoneless hay que setear los @Input por la API: mutar el objeto
    // directamente no notifica al framework.
    fixture.componentRef.setInput('tarea', Object.assign(new Tarea(), tareaPrincipal))
    fixture.componentRef.setInput('field', 'descripcion')
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should not show if field has no error', () => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('[data-testid="error-message-descripcion"]')).toBeNull()
  })

  it('should show if field has an error', () => {
    const tarea = Object.assign(new Tarea(), tareaPrincipal, { descripcion: '' })
    tarea.validar()

    fixture.componentRef.setInput('tarea', tarea)
    fixture.detectChanges()

    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('[data-testid="error-message-descripcion"]')).toBeTruthy()
  })
})