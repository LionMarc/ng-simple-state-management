import { TestBed } from '@angular/core/testing';

import { StoreMock } from 'ngssm-store/testing';
import { Store } from 'ngssm-store';

import { RemoteDataLoadingGuard, ngssmReloadRemoteData } from './remote-data-loading.guard';
import { LoadRemoteDataAction, RemoteDataActionType } from '../actions';

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

describe(`ngssmReloadRemoteData`, () => {
  let storeMock: StoreMock;

  beforeEach(() => {
    storeMock = new StoreMock({});
    TestBed.configureTestingModule({ providers: [{ provide: Store, useValue: storeMock }] });
  });

  it(`should return true`, () => {
    const func = ngssmReloadRemoteData('testing');
    const result = TestBed.runInInjectionContext(() => func());
    expect(result).toBeTrue();
  });

  it(`should dispatch an action of type '${RemoteDataActionType.loadRemoteData}'`, () => {
    spyOn(storeMock, 'dispatchAction');

    const func = ngssmReloadRemoteData('testing');
    TestBed.runInInjectionContext(() => func());

    expect(storeMock.dispatchAction).toHaveBeenCalledWith(new LoadRemoteDataAction('testing', { forceReload: true }));
  });
});
