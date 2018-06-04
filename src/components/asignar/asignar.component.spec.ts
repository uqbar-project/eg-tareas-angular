import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

// routing
import { AppRoutingModule, routingComponents } from '../../app/app-routing.module'
import { APP_BASE_HREF } from '@angular/common'

// componentes propios
import { AsignarComponent } from './asignar.component'
import { UsuariosService } from '../../services/usuarios.service'
import { TareasService } from '../../services/tareas.service'
import { FilterTareas } from '../../pipes/filterTareas.pipe';

describe('AsignarComponent', () => {
  let component: AsignarComponent
  let fixture: ComponentFixture<AsignarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        AsignarComponent,
        routingComponents, 
        FilterTareas
      ],
      imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        FontAwesomeModule
      ],
      providers: [UsuariosService, TareasService,
        {provide: APP_BASE_HREF, useValue : '/' }]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
