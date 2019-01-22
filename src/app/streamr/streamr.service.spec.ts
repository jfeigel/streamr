import { TestBed } from '@angular/core/testing';

import { StreamrService } from './streamr.service';

describe('StreamrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StreamrService = TestBed.get(StreamrService);
    expect(service).toBeTruthy();
  });
});
