export class Usuario {

  static fromJSON(nombre: string): Usuario {
    return nombre ? new Usuario(nombre) : null
  }

  constructor(public nombre: string) { }

  // Lo necesitamos para mostrar el valor seleccionado en el combo
  equals(otro) {
    return otro && this.nombre === otro.nombre
  }

}