import { HttpErrorResponse } from '@angular/common/http';

import { State } from 'ngssm-store';

import { DateTime } from 'luxon';

import { DataSourceValueReducer } from './data-source-value.reducer';
import { NgssmClearDataSourceValueAction, NgssmDataActionType, NgssmSetDataSourceValueAction } from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';

describe('DataSourceValueReducer', () => {
  let reducer: DataSourceValueReducer;
  let state: State;

  beforeEach(() => {
    reducer = new DataSourceValueReducer();
    state = {
      [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
    };
  });

  [NgssmDataActionType.setDataSourceValue, NgssmDataActionType.clearDataSourceValue].forEach((actionType: string) => {
    it(`should process action of type '${actionType}'`, () => {
      expect(reducer.processedActions).toContain(actionType);
    });
  });

  it('should return input state when processing not valid action type', () => {
    const updatedState = reducer.updateState(state, { type: 'not-processed' });

    expect(updatedState).toBe(state);
  });

  describe(`when processing action of type '${NgssmDataActionType.setDataSourceValue}'`, () => {
    beforeEach(() => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              value: ['test'],
              additionalProperties: {},
              parameterPartialValidity: {}
            }
          }
        }
      });
    });

    it(`should update source value status with the status set in action`, () => {
      const action = new NgssmSetDataSourceValueAction('data-providers', NgssmDataSourceValueStatus.loaded);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.status).toEqual(NgssmDataSourceValueStatus.loaded);
    });

    it(`should update source value value with the value set in action`, () => {
      const action = new NgssmSetDataSourceValueAction('data-providers', NgssmDataSourceValueStatus.loaded, ['prv1', 'prv3']);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.value).toEqual(['prv1', 'prv3']);
    });

    it(`should update source value error with the error set in action`, () => {
      const action = new NgssmSetDataSourceValueAction('data-providers', NgssmDataSourceValueStatus.loaded, undefined, {
        message: 'ko'
      } as unknown as HttpErrorResponse);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.httpErrorResponse).toEqual({
        message: 'ko'
      } as unknown as HttpErrorResponse);
    });
  });

  describe(`when processing action of type '${NgssmDataActionType.clearDataSourceValue}'`, () => {
    const action = new NgssmClearDataSourceValueAction('data-providers');

    beforeEach(() => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              value: ['test'],
              lastLoadingDate: DateTime.fromISO('2023-12-18T12:34:00Z'),
              parameter: 'previous',
              additionalProperties: {},
              parameterIsValid: true,
              parameterPartialValidity: {
                test: false
              },
              httpErrorResponse: {
                message: 'error'
              } as unknown as HttpErrorResponse
            }
          }
        }
      });
    });

    it(`should reset source value to undefined`, () => {
      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.value).toBeUndefined();
    });

    it(`should reset status value to '${NgssmDataSourceValueStatus.none}'`, () => {
      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.status).toEqual(NgssmDataSourceValueStatus.none);
    });

    it(`should reset timestamp value to undefined`, () => {
      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.lastLoadingDate).toBeUndefined();
    });

    it(`should reset parameter to undefined if clearParameter is set to true`, () => {
      const updatedState = reducer.updateState(state, new NgssmClearDataSourceValueAction('data-providers', true));

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameter).toBeUndefined();
    });

    it(`should not reset parameter to undefined if clearParameter is not set to true`, () => {
      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameter).toEqual('previous');
    });

    it(`should reset parameter validity to undefined if clearParameter is set to true`, () => {
      const updatedState = reducer.updateState(state, new NgssmClearDataSourceValueAction('data-providers', true));

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameterIsValid).toBeUndefined();
    });

    it(`should not reset parameter validity to undefined if clearParameter is not set to true`, () => {
      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameterIsValid).toEqual(true);
    });

    it(`should reset parameter partial validity to undefined if clearParameter is set to true`, () => {
      const updatedState = reducer.updateState(state, new NgssmClearDataSourceValueAction('data-providers', true));

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameterPartialValidity).toBeUndefined();
    });

    it(`should not reset parameter partial validity to undefined if clearParameter is not set to true`, () => {
      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameterPartialValidity).toEqual({
        test: false
      });
    });

    it(`should reset http error response to undefined`, () => {
      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.httpErrorResponse).toBeUndefined();
    });
  });
});
