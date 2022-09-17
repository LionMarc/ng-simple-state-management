import { TestBed } from '@angular/core/testing';

import { RemoteDataLoadingGuard } from './remote-data-loading.guard';

describe('RemoteDataLoadingGuard', () => {
  let guard: RemoteDataLoadingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RemoteDataLoadingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
