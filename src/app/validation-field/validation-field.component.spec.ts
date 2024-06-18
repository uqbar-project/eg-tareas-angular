import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ValidationFieldComponent } from './validation-field.component'
import { tareaPrincipal } from 'services/httpClientSpy'
import { Tarea } from 'domain/tarea'

describe('ValidationFieldComponent', () => {
  let component: ValidationFieldComponent
  let fixture: ComponentFixture<ValidationFieldComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationFieldComponent]
    })
    .compileComponents()

    fixture = TestBed.createComponent(ValidationFieldComponent)
    component = fixture.componentInstance
    component.tarea = Object.assign(new Tarea(), { ...tareaPrincipal })
    component.field = 'descripcion'
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should not show if field has no error', () => {
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('[data-testid="error-message-descripcion"]')).toBeNull()
  })

  it('should not show if field has no error', () => {
    component.tarea.descripcion = ''
    component.tarea.validar()
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('[data-testid="error-message-descripcion"]')).toBeTruthy()
  })

})
