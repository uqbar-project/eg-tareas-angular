/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TareasService } from './tareas.service';

describe('Service: Tareas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TareasService]
    });
  });

  it('should ...', inject([TareasService], (service: TareasService) => {
    expect(service).toBeTruthy();
  }));
});
