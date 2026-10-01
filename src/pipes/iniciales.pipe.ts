import { Pipe, type PipeTransform } from '@angular/core'
import type { Usuario } from 'domain/usuario'

/**
 * Devuelve las iniciales de un usuario para el avatar: "Gabriel Pérez" -> "GP".
 * Con un solo nombre se queda con las dos primeras letras de esa palabra.
 */
@Pipe({ name: 'iniciales', standalone: true })
export class InicialesPipe implements PipeTransform {
  transform(usuario: Usuario | undefined): string {
    if (!usuario) return '?'
    const partes = usuario.nombre.trim().split(/\s+/).filter(Boolean)
    if (partes.length === 0) return '?'
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
  }
}

/**
 * Elige un color de avatar a partir del nombre.
 *
 * No es aleatorio: sale de un hash del nombre, asi la misma persona tiene
 * siempre el mismo color. Con `Math.random()` el avatar cambiaria de color en
 * cada change detection, que es justo lo que un avatar no debe hacer.
 */
@Pipe({ name: 'colorAvatar', standalone: true })
export class ColorAvatarPipe implements PipeTransform {
  private readonly paleta = [
    'avatar-0',
    'avatar-1',
    'avatar-2',
    'avatar-3',
    'avatar-4',
    'avatar-5',
    'avatar-6',
    'avatar-7'
  ]

  transform(usuario: Usuario | undefined): string {
    if (!usuario) return 'avatar-vacio'
    let hash = 0
    const nombre = usuario.nombre
    for (let i = 0; i < nombre.length; i++) {
      hash = (hash * 31 + nombre.charCodeAt(i)) | 0
    }
    return this.paleta[Math.abs(hash) % this.paleta.length]
  }
}
