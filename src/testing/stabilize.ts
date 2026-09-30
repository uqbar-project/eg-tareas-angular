import type { ComponentFixture } from '@angular/core/testing'

/**
 * En zoneless `whenStable()` NO rastrea los `await` "pelados" de `ngOnInit`
 * (solo PendingTasks), asi que la promesa de carga de datos resuelve despues de
 * que.whenStable() ya devolvio. Hay que vaciar las microtareas a mano.
 */
export const flushMicrotasks = async (times = 20) => {
  for (let i = 0; i < times; i++) {
    await Promise.resolve()
  }
}

/**
 * Detecta cambios, espera a que se resuelvan las promesas pendientes y vuelve a
 * detectar cambios. Reemplaza el par detectChanges/whenStable de la epoca zone.js.
 */
export const stabilize = async (fixture: ComponentFixture<unknown>) => {
  // Dos rondas: la segunda cubre las cadenas async que recien empiezan dentro
  // de la primera (por ejemplo el catch de actualizarTarea, que vuelve a pedir
  // las tareas antes de registrar el error).
  for (let i = 0; i < 2; i++) {
    fixture.detectChanges()
    await fixture.whenStable()
    await flushMicrotasks()
  }
  fixture.detectChanges()
}