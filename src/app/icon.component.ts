import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { ICONOS, type NombreIcono } from './icons'

/**
 * Ícono SVG inline.
 *
 * Antes la app usaba Font Awesome para mostrar cuatro íconos, lo que costaba
 * unos 112 kB del bundle inicial. Como son íconos fijos que nunca se
 * parametrizan en runtime, alcanza con los paths SVG que viven acá.
 *
 * Los paths salen de Font Awesome 7 (licencia CC BY 4.0 / SIL OFL 1.1).
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <svg
      class="icon"
      [attr.viewBox]="def().viewBox"
      fill="currentColor"
      aria-hidden="true"
      focusable="false">
      <path [attr.d]="def().path" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
    }

    .icon {
      width: 1em;
      height: 1em;
    }
  `
})
export class IconComponent {
  readonly nombre = input.required<NombreIcono>()

  protected readonly def = () => ICONOS[this.nombre()]
}
