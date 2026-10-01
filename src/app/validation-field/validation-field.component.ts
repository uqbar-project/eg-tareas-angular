import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import type { Tarea } from 'domain/tarea'

@Component({
  selector: 'validation-field',
  standalone: true,
  imports: [],
  templateUrl: './validation-field.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './validation-field.component.css'
})
export class ValidationFieldComponent {
  @Input() tarea!: Tarea
  @Input() field!: string
}
