import { of } from 'rxjs'
import { Tarea } from 'domain/tarea'
import { Usuario } from 'domain/usuario'
import { REST_SERVER_URL } from '../services/configuration'

export const usuarioAsignatario = new Usuario('Gabriel Pérez')
export const tareaPrincipal = new Tarea(
  1,
  'Testear httpClient con stubs',
  'Iteración 1',
  usuarioAsignatario,
  new Date('2020-05-02'),
  50
)

const tareasStub = [
  tareaPrincipal,
  new Tarea(
    2,
    'Desarrollar testeo e2e',
    'Iteración 2',
    undefined,
    new Date('2020-11-12'),
    0
  )
].map((tarea) => tarea.toJSON())

const usuariosStub = [
  { id: 1, nombre: 'Victoria Marconi' },
  { id: 2, nombre: 'Gabriel Pérez' }
]

export interface HttpClientSpy {
  get: ReturnType<typeof vi.fn>
  put: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
}

export const getHttpClientSpy = (): HttpClientSpy => {
  const httpClientSpy: HttpClientSpy = {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn()
  }

  httpClientSpy.get.mockImplementation((url: string) => {
    switch (url) {
      case `${REST_SERVER_URL}/tareas`:
        return of(tareasStub)
      case `${REST_SERVER_URL}/tareas/1`:
        return of(tareasStub[0])
      case `${REST_SERVER_URL}/usuarios`:
        return of(usuariosStub)
      default:
        throw new Error(`httpClientSpy.get: URL sin stub para "${url}"`)
    }
  })

  httpClientSpy.put.mockReturnValue(of(tareasStub[0]))
  httpClientSpy.post.mockImplementation((_url: string, body: object) =>
    of({ ...body, id: 3 })
  )
  return httpClientSpy
}
