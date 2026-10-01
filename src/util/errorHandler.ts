/**
 * Muestra un error al usuario y lo saca solo a los 5 segundos.
 *
 * `errors` es un signal y no un array: en zoneless un `push` o un `length = 0`
 * no agendan change detection, asi que con un array el mensaje apareceria en los
 * tests (que fuerzan `detectChanges`) pero no en el browser.
 */
import { type WritableSignal } from '@angular/core'

export function mostrarError(
  component: { errors: WritableSignal<string[]> },
  error: unknown
): void {
  const { status } = error as { status?: number }
  const originalError = (error as { error?: unknown }).error ?? error
  let errorMessage =
    (originalError as { message?: string }).message ??
    'Ocurrió un error inesperado'
  if (status === 0) {
    errorMessage =
      'No hay conexión con el backend, revise si el servidor remoto está levantado.'
  } else if (status === 500) {
    errorMessage =
      'Hubo un error al realizar la operación. Consulte al administrador del sistema.'
    console.error(error)
  }
  component.errors.update(errors => [...errors, errorMessage as string])
  setTimeout(() => {
    component.errors.set([])
  }, 5000)
}
