import { EstadoCumplimientoPipe } from './estadoCumplimiento.pipe'

describe('Pipe: EstadoCumplimiento', () => {
  let pipe: EstadoCumplimientoPipe

  beforeEach(() => {
    pipe = new EstadoCumplimientoPipe()
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy()
  })

  it('arma el chip bajo los 40', () => {
    expect(pipe.transform(0)).toBe('chip-bajo')
    expect(pipe.transform(39.99)).toBe('chip-bajo')
  })

  it('arma el chip medio entre 40 y 80', () => {
    expect(pipe.transform(40)).toBe('chip-medio')
    expect(pipe.transform(50)).toBe('chip-medio')
    expect(pipe.transform(79.99)).toBe('chip-medio')
  })

  it('arma el chip alto desde 80', () => {
    expect(pipe.transform(80)).toBe('chip-alto')
    expect(pipe.transform(100)).toBe('chip-alto')
  })

  it('los cortes son exactos', () => {
    // los bordes importan: 40 es medio, no bajo, y 80 es alto, no medio
    expect(pipe.transform(40)).not.toBe('chip-bajo')
    expect(pipe.transform(80)).not.toBe('chip-medio')
  })
})
