/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UsuariosService } from './usuarios.service';

describe('Service: Usuario', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsuariosService]
    });
  });

  it('should ...', inject([UsuariosService], (service: UsuariosService) => {
    expect(service).toBeTruthy();
  }));
});
