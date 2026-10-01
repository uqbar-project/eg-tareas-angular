export function mostrarError(
  component: { errors: unknown[] },
  error: unknown
): void {
  const { status } = error as { status?: number }
  const originalError = (error as { error?: unknown }).error ?? error
  let errorMessage = (originalError as { message?: string }).message
  if (status === 0) {
    errorMessage =
      'No hay conexión con el backend, revise si el servidor remoto está levantado.'
  } else if (status === 500) {
    errorMessage =
      'Hubo un error al realizar la operación. Consulte al administrador del sistema.'
    console.error(error)
  }
  component.errors.push(errorMessage)
  setTimeout(() => {
    component.errors.length = 0
  }, 5000)
}
