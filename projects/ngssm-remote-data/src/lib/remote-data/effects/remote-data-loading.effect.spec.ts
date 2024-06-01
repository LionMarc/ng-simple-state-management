import { Injectable, inject } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { StoreMock } from 'ngssm-store/testing';

import { RemoteDataLoadingEffect } from './remote-data-loading.effect';
import { DataStatus, NGSSM_REMOTE_DATA_PROVIDER, RemoteDataProvider, provideRemoteDataFunc } from '../model';
import { RemoteDataStateSpecification, updateRemoteDataState } from '../state';
import { LoadRemoteDataAction, RegisterLoadedRemoteDataAction } from '../actions';

import { Observable } from 'rxjs';

const remoteDataKeyForFunc = 'remote-data-key-for-func';
const remoteDataKeyForClass = 'remote-data-key-for-class';

@Injectable({
  providedIn: 'root'
})
class RemoteDataTesting implements RemoteDataProvider {
  public remoteDataKey: string = remoteDataKeyForClass;

  constructor(private httpClient: HttpClient) {}

  public get(): Observable<string[]> {
    return this.httpClient.get<string[]>('/testing-class');
  }
}

describe('RemoteDataLoadingEffect', () => {
  let effect: RemoteDataLoadingEffect;
  let store: StoreMock;
  let loadingFunc = () => {
    const httpClient = inject(HttpClient);
    return httpClient.get<string[]>('/testing-func');
  };
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    store = new StoreMock({
      [RemoteDataStateSpecification.featureStateKey]: RemoteDataStateSpecification.initialState
    });
    TestBed.configureTestingModule({
    imports: [MatSnackBarModule],
    providers: [
        RemoteDataLoadingEffect,
        provideRemoteDataFunc(remoteDataKeyForFunc, loadingFunc),
        {
            provide: NGSSM_REMOTE_DATA_PROVIDER,
            useClass: RemoteDataTesting,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    effect = TestBed.inject(RemoteDataLoadingEffect);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe(`Remote data as func`, () => {
    beforeEach(() => {
      const state = updateRemoteDataState(store.stateValue, {
        [remoteDataKeyForFunc]: {
          $set: {
            status: DataStatus.loading,
            data: ['testing']
          }
        }
      });
      store.stateValue = state;
    });

    it(`should call the function associated to the remote data`, () => {
      spyOn(store, 'dispatchAction');

      effect.processAction(store as any, store.stateValue, new LoadRemoteDataAction(remoteDataKeyForFunc, { forceReload: true }));

      const req = httpTestingController.expectOne('/testing-func');

      req.flush(['first', 'second']);

      expect(store.dispatchAction).toHaveBeenCalledWith(
        new RegisterLoadedRemoteDataAction(remoteDataKeyForFunc, DataStatus.loaded, ['first', 'second'], undefined)
      );
    });
  });

  describe(`Remote data as class`, () => {
    beforeEach(() => {
      const state = updateRemoteDataState(store.stateValue, {
        [remoteDataKeyForClass]: {
          $set: {
            status: DataStatus.loading,
            data: ['testing']
          }
        }
      });
      store.stateValue = state;
    });

    it(`should call the function associated to the remote data`, () => {
      spyOn(store, 'dispatchAction');

      effect.processAction(store as any, store.stateValue, new LoadRemoteDataAction(remoteDataKeyForClass, { forceReload: true }));

      const req = httpTestingController.expectOne('/testing-class');

      req.flush(['first', 'second']);

      expect(store.dispatchAction).toHaveBeenCalledWith(
        new RegisterLoadedRemoteDataAction(remoteDataKeyForClass, DataStatus.loaded, ['first', 'second'], undefined)
      );
    });
  });
});
