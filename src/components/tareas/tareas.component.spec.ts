import { registerLocaleData } from '@angular/common'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import localeEs from '@angular/common/locales/es'
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { throwError } from 'rxjs'
import { AppRoutingModule, routingComponents } from 'src/app/app-routing.module'
import { httpClientSpy } from 'src/services/httpClientSpy'

import { IconsModule } from '../../app/icons.module'
import { FilterTareas } from '../../pipes/filterTareas.pipe'
import { OrderTareas } from '../../pipes/orderTareas.pipe'
import { TareasComponent } from './tareas.component'
import { UsuariosService } from 'src/services/usuarios.service'
import { TareasService } from 'src/services/tareas.service'
import { TareasMockService } from 'src/services/tareas.mock.service'
import { UsuariosMockService } from 'src/services/ususarios.mock.service'

//
/** Registramos el locale ES para formatear números */
// Font Awesome para los íconos
//
// routing
// componentes propios

registerLocaleData(localeEs)


describe('TareasComponent', () => {
  let component: TareasComponent
  let fixture: ComponentFixture<TareasComponent>
  let routerSpy: jasmine.SpyObj<Router>
  
  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl'])

    TestBed.configureTestingModule({
      declarations: [
        FilterTareas,
        OrderTareas,
        routingComponents
      ],
      imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        FontAwesomeModule,
        IconsModule,
        // Super importante -> para poder mockear el service hay que importar el módulo HttpClient
        HttpClientModule,
      ],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy, }
      ]
    }).compileComponents()

    TestBed.overrideComponent(TareasComponent, {
      set: {
        providers: [
          { provide: Router, useValue: routerSpy, },
          { provide: UsuariosService, useClass: UsuariosMockService},
          { provide: TareasService, useClass: TareasMockService}
        ]
      }
    })

    fixture = TestBed.createComponent(TareasComponent)
    // Estas tres líneas activan el envío de mensajes necesario
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()

    component = fixture.componentInstance
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initially show 2 pending tasks', () => {
    expect(2).toBe(component.tareas.length)
  })

  it('first task can be marked as done', () => {
    expect(getByTestId('cumplir_1')).toBeTruthy()
  })

  it('when a task is done, it has 100% of completion', () => {
    getByTestId('cumplir_1').click()
    fixture.detectChanges()
    // Chequeamos que el objeto de dominio tarea responde correctamente,
    // pero también el binding entre componente y vista
    expect(getByTestId('porcentaje_1').textContent).toBe('100,00')
    // https://daveceddia.com/jasmine-2-spy-cheat-sheet/
    // Chequeamos que se haya enviado la información correctamente al backend
    const tareaActualizada = httpClientSpy.put.calls.mostRecent().args[1]
    expect(tareaActualizada.porcentajeCumplimiento).toBe(100)
  })

  it('unassign first task', async () => {
    getByTestId('desasignar_1').click()
    fixture.detectChanges()
    expect(getByTestId('asignatario_1').textContent).toBe('')
  })

  it('searching for second task should have one tr in tasks list', () => {
    component.tareaBuscada = 'e2e'
    fixture.detectChanges()
    const resultHtml = fixture.debugElement.nativeElement
    expect(resultHtml.querySelectorAll('[data-testid="fila-tarea"]').length).toBe(1)
  })

  it('unassign - should catch error gracefully', fakeAsync(() => {
    // En lugar de callFake podemos usar returnValue como se muestra abajo
    spyOn(component.tareasService, 'actualizarTarea').and.callFake(
      () => throwError(() => new Error('Fake Error'))
    )
    getByTestId('desasignar_1').click()
    tick(1000)
    fixture.detectChanges()
    
    expect(getByTestId('error-message')?.innerHTML).toBeTruthy()
    // Importante para que no falle con "Error: 1 timer(s) still in the queue"
    // tick(2000)
    // o mejor...
    flush()
  }))

  it('finish - should catch error gracefully', fakeAsync(() => {
    spyOn(component.tareasService, 'actualizarTarea').and.returnValue(
      throwError(() => new Error('Fake Error'))
    )
    getByTestId('cumplir_1').click()
    tick(1000)
    fixture.detectChanges()
    expect(getByTestId('error-message')?.innerHTML).toBeTruthy()
    flush()
  }))

  it('create new task should navigate', async () => {
    getByTestId('nueva-tarea').click()
    
    fixture.detectChanges()

    const route = routerSpy.navigateByUrl.calls.first().args[0]
    expect(route).toBe('/nuevaTarea')
  })

  it('assign task should navigate', () => {
    getByTestId('asignar_2').click()
    
    fixture.detectChanges()

    // const route = routerSpy.navigate.calls.first().args[0]
    // expect(route).toEqual(['/asignarTarea', 2])
  
    // Con destructuring
    const [ url, tareaId ] = routerSpy.navigate.calls.first().args[0]
    expect(url).toBe('/asignarTarea')
    expect(tareaId).toBe(2)
  })

  function getByTestId(testId: string) {
    const resultHtml = fixture.debugElement.nativeElement
    return resultHtml.querySelector(`[data-testid="${testId}"]`)
  }
})
