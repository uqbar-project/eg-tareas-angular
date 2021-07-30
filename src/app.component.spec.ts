import { CommonModule } from '@angular/common'
import { async, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { RouterTestingModule } from '@angular/router/testing'

import { AppComponent } from './app.component'
import { IconsModule } from './icons.module'

import './app.module'
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        CommonModule,
        IconsModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents()
  }))
  it('should create the app well', async(() => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.debugElement.componentInstance
    expect(app).toBeTruthy()
  }))
})
