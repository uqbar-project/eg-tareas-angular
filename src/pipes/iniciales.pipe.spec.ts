import { Usuario } from 'domain/usuario'
import { ColorAvatarPipe, InicialesPipe } from './iniciales.pipe'

describe('Pipe: Iniciales', () => {
  const pipe = new InicialesPipe()

  it('toma la primera y la última palabra', () => {
    expect(pipe.transform(new Usuario('Gabriel Pérez'))).toBe('GP')
    expect(pipe.transform(new Usuario('Nahuel Palumbo'))).toBe('NP')
    expect(pipe.transform(new Usuario('Julián Castro'))).toBe('JC')
  })

  it('con un solo nombre toma las dos primeras letras', () => {
    expect(pipe.transform(new Usuario('Ana'))).toBe('AN')
  })

  it('sin asignatario muestra ?', () => {
    expect(pipe.transform(undefined)).toBe('?')
  })

  it('aguanta espacios de sobra', () => {
    expect(pipe.transform(new Usuario('  Gabriel   Pérez  '))).toBe('GP')
  })
})

describe('Pipe: ColorAvatar', () => {
  const pipe = new ColorAvatarPipe()

  it('es estable: el mismo nombre da siempre el mismo color', () => {
    const a = pipe.transform(new Usuario('Gabriel Pérez'))
    const b = pipe.transform(new Usuario('Gabriel Pérez'))
    expect(a).toBe(b)
  })

  it('distribuye distintos nombres en distintos colores', () => {
    const nombres = [
      'Gabriel Pérez',
      'Nahuel Palumbo',
      'Julián Castro',
      'Victoria Marconi'
    ]
    const colores = nombres.map(n => pipe.transform(new Usuario(n)))
    // no exigimos que sean todos distintos, pero la paleta tiene que separar
    // al menos a dos personas distintas
    expect(new Set(colores).size).toBeGreaterThan(1)
  })

  it('sin asignatario usa el estilo vacio', () => {
    expect(pipe.transform(undefined)).toBe('avatar-vacio')
  })

  it('solo devuelve clases de la paleta', () => {
    for (let i = 0; i < 200; i++) {
      const nombre = `Persona Numero ${i}`
      expect(pipe.transform(new Usuario(nombre))).toMatch(/^avatar-\d$/)
    }
  })
})
