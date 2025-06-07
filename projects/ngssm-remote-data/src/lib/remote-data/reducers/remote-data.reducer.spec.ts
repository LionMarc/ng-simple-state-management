import { TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';

import { State } from 'ngssm-store';

import { LoadRemoteDataAction, RemoteDataActionType } from '../actions';
import { DataStatus, NGSSM_REMOTE_DATA_PROVIDER, RemoteDataProvider } from '../model';
import { RemoteDataStateInitializer } from '../remote-data-state-initializer';
import { RemoteDataStateSpecification, selectRemoteData, updateRemoteDataState } from '../state';
import { RemoteDataReducer } from './remote-data.reducer';

describe('RemoteDataReducer', () => {
  let reducer: RemoteDataReducer;
  let state: State;

  beforeEach(() => {
    state = {
      [RemoteDataStateSpecification.featureStateKey]: RemoteDataStateSpecification.initialState
    };
    const remoteDataProviders: RemoteDataProvider[] = [
      {
        remoteDataKey: 'data001',
        get: (): Observable<number> => of(1)
      },
      {
        remoteDataKey: 'data002',
        cacheDurationInSeconds: 100,
        get: (): Observable<number> => of(1)
      }
    ];
    TestBed.configureTestingModule({
      providers: [
        RemoteDataStateInitializer,
        RemoteDataReducer,
        ...remoteDataProviders.map((r) => ({
          provide: NGSSM_REMOTE_DATA_PROVIDER,
          useValue: r,
          multi: true
        }))
      ]
    });
    state = TestBed.inject(RemoteDataStateInitializer).initializeState(state);
    reducer = TestBed.inject(RemoteDataReducer);
  });

  [RemoteDataActionType.loadRemoteData, RemoteDataActionType.registerLoadedRemoteData].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });

  describe(`when processing action of type '${RemoteDataActionType.loadRemoteData}'`, () => {
    it(`should return the input state when the remote data key is not valid`, () => {
      const action = new LoadRemoteDataAction('wrong-key');

      const updatedState = reducer.updateState(state, action);

      expect(updatedState).toBe(state);
    });

    it(`should return the input state when the provider associated to the key does not exist`, () => {
      const action = new LoadRemoteDataAction('data003');

      const updatedState = reducer.updateState(state, action);

      expect(updatedState).toBe(state);
    });

    it(`should set status to ${DataStatus.loading} when no cache duration is set in data provider`, () => {
      const action = new LoadRemoteDataAction('data001');

      const updatedState = reducer.updateState(state, action);

      expect(selectRemoteData(updatedState, 'data001')?.status).toEqual(DataStatus.loading);
    });

    it(`should set status to ${DataStatus.loading} when forceReload is set to true in action params`, () => {
      state = updateRemoteDataState(state, {
        data002: {
          status: { $set: DataStatus.loaded },
          timestamp: { $set: new Date() }
        }
      });
      const action = new LoadRemoteDataAction('data002', { forceReload: true });

      const updatedState = reducer.updateState(state, action);

      expect(selectRemoteData(updatedState, 'data002')?.status).toEqual(DataStatus.loading);
    });

    [DataStatus.none, DataStatus.error, DataStatus.notFound].forEach((status) => {
      it(`should set status to ${DataStatus.loading} when status is ${status}`, () => {
        state = updateRemoteDataState(state, {
          data002: {
            status: { $set: status },
            timestamp: { $set: new Date() }
          }
        });
        const action = new LoadRemoteDataAction('data002');

        const updatedState = reducer.updateState(state, action);

        expect(selectRemoteData(updatedState, 'data002')?.status).toEqual(DataStatus.loading);
      });
    });

    it(`should set status to ${DataStatus.loading} when timestamp is not set`, () => {
      state = updateRemoteDataState(state, {
        data002: {
          status: { $set: DataStatus.loaded },
          timestamp: { $set: undefined }
        }
      });
      const action = new LoadRemoteDataAction('data002');

      const updatedState = reducer.updateState(state, action);

      expect(selectRemoteData(updatedState, 'data002')?.status).toEqual(DataStatus.loading);
    });

    it(`should set status to ${DataStatus.loading} when data lifetime is over`, () => {
      const date = new Date();
      date.setTime(new Date().getTime() - 120000);
      state = updateRemoteDataState(state, {
        data002: {
          status: { $set: DataStatus.loaded },
          timestamp: { $set: date }
        }
      });
      const action = new LoadRemoteDataAction('data002');

      const updatedState = reducer.updateState(state, action);

      expect(selectRemoteData(updatedState, 'data002')?.status).toEqual(DataStatus.loading);
    });

    it(`should set status to ${DataStatus.loading} when data lifetime is not over`, () => {
      const date = new Date();
      date.setTime(new Date().getTime() - 80000);
      state = updateRemoteDataState(state, {
        data002: {
          status: { $set: DataStatus.loaded },
          timestamp: { $set: date }
        }
      });
      const action = new LoadRemoteDataAction('data002');

      const updatedState = reducer.updateState(state, action);

      expect(selectRemoteData(updatedState, 'data002')?.status).toEqual(DataStatus.loaded);
    });

    it(`should set the getterParams to undefined when params is not set in action`, () => {
      state = updateRemoteDataState(state, {
        data002: {
          status: { $set: DataStatus.loaded },
          timestamp: { $set: undefined },
          getterParams: { $set: { serviceParams: 45 } }
        }
      });

      const action = new LoadRemoteDataAction('data002');

      const updatedState = reducer.updateState(state, action);

      expect(selectRemoteData(updatedState, 'data002')?.getterParams).toEqual(undefined);
    });

    it(`should update the getterParams with the value set in action when keepStoredGetterParams is not set`, () => {
      state = updateRemoteDataState(state, {
        data002: {
          status: { $set: DataStatus.loaded },
          timestamp: { $set: undefined },
          getterParams: { $set: { serviceParams: 45 } }
        }
      });

      const action = new LoadRemoteDataAction('data002', { forceReload: false, params: { serviceParams: 67 } });

      const updatedState = reducer.updateState(state, action);

      expect(selectRemoteData(updatedState, 'data002')?.getterParams).toEqual({ serviceParams: 67 });
    });

    it(`should update the getterParams with the value set in action when keepStoredGetterParams is set to false`, () => {
      state = updateRemoteDataState(state, {
        data002: {
          status: { $set: DataStatus.loaded },
          timestamp: { $set: undefined },
          getterParams: { $set: { serviceParams: 45 } }
        }
      });

      const action = new LoadRemoteDataAction('data002', {
        forceReload: false,
        params: { serviceParams: 67 },
        keepStoredGetterParams: false
      });

      const updatedState = reducer.updateState(state, action);

      expect(selectRemoteData(updatedState, 'data002')?.getterParams).toEqual({ serviceParams: 67 });
    });

    it(`should not update the getterParams with the value set in action when keepStoredGetterParams is set to true`, () => {
      state = updateRemoteDataState(state, {
        data002: {
          status: { $set: DataStatus.loaded },
          timestamp: { $set: undefined },
          getterParams: { $set: { serviceParams: 45 } }
        }
      });

      const action = new LoadRemoteDataAction('data002', {
        forceReload: false,
        params: { serviceParams: 67 },
        keepStoredGetterParams: true
      });

      const updatedState = reducer.updateState(state, action);

      expect(selectRemoteData(updatedState, 'data002')?.getterParams).toEqual({ serviceParams: 45 });
    });
  });
});
