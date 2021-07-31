import { CommonModule } from '@angular/common'
import { waitForAsync, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { RouterTestingModule } from '@angular/router/testing'

import { AppComponent } from './app.component'
import { IconsModule } from './icons.module'

import './app.module'

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
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
  it('should create the app well', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.debugElement.componentInstance
    expect(app).toBeTruthy()
  }))
})
