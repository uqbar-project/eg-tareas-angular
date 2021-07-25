export type UsuarioJSON = {
  nombre: string
}
export class Usuario {

  static fromJSON(nombre: string): Usuario | null {
    return nombre ? new Usuario(nombre) : null
  }

  constructor(public nombre: string) { }

  // Lo necesitamos para mostrar el valor seleccionado en el combo
  equals(otro: Usuario) {
    return otro && this.nombre === otro.nombre
  }

}