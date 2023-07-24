import { of } from 'rxjs'
import { Tarea } from 'src/domain/tarea'
import { Usuario } from 'src/domain/usuario'
import { REST_SERVER_URL } from './configuration'
import * as dayjs from 'dayjs'

export const usuarioAsignatario = new Usuario('Gabriel Pérez')
export const tareaPrincipal = new Tarea(1, 'Testear httpClient con stubs', 'Iteración 1', usuarioAsignatario, dayjs('2020-05-02'), 50)

const tareasStub = [
  tareaPrincipal,
  new Tarea(2, 'Desarrollar testeo e2e', 'Iteración 2', undefined, dayjs('2020-11-12'), 0),
].map((tarea) => tarea.toJSON())

const usuariosStub = [
  { id: 1, nombre: 'Victoria Marconi', },
  { id: 2, nombre: 'Gabriel Pérez'}
]

export const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'put', 'post'])

httpClientSpy.get.withArgs(`${REST_SERVER_URL}/tareas`).and.returnValue(of(tareasStub))
httpClientSpy.get.withArgs(`${REST_SERVER_URL}/tareas/1`).and.returnValue(of(tareasStub[0]))
httpClientSpy.get.withArgs(`${REST_SERVER_URL}/usuarios`).and.returnValue(of(usuariosStub))
httpClientSpy.put.and.returnValue(of(tareasStub[0]))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
httpClientSpy.post.and.callFake((_url: string, body: any) => of({ ...body, id: 3 }))