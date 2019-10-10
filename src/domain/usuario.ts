export class Usuario {

  nombre: string

  static fromJSON(nombre: string): Usuario {
    if (!nombre) {
      return null
    }
    return new Usuario(nombre)
  }

  constructor(_nombre: string) {
    this.nombre = _nombre
  }

  // Lo necesitamos para mostrar el valor seleccionado en el combo
  equals(_otro) {
    return _otro && this.nombre === _otro.nombre
  }

}