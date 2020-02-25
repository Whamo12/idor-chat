import { TestBed } from '@angular/core/testing';

import { GlobalManagerService } from './global-manager.service';

describe('GlobalManagerService', () => {
  let service: GlobalManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
