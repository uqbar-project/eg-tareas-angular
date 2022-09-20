import { Tarea } from 'src/domain/tarea'
import { Component, Input } from '@angular/core'

@Component({
  selector: 'validation-field',
  templateUrl: './validationField.component.html',
  styleUrls: ['./validationField.component.css']
})
export class ValidationFieldComponent {
  @Input() tarea!: Tarea
  @Input() field!: string
}
