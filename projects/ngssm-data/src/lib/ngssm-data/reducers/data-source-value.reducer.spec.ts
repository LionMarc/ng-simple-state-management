import { HttpErrorResponse } from '@angular/common/http';

import { State } from 'ngssm-store';

import { DateTime } from 'luxon';

import { DataSourceValueReducer } from './data-source-value.reducer';
import {
  NgssmClearDataSourceValueAction,
  NgssmDataActionType,
  NgssmLoadDataSourceAdditionalPropertyValueAction,
  NgssmSetDataSourceAdditionalPropertyValueAction,
  NgssmSetDataSourceParameterAction,
  NgssmSetDataSourceParameterValidityAction,
  NgssmSetDataSourceValueAction,
  NgssmUpdateDataSourceParameterAction
} from '../actions';
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

  [
    NgssmDataActionType.setDataSourceValue,
    NgssmDataActionType.clearDataSourceValue,
    NgssmDataActionType.setDataSourceParameter,
    NgssmDataActionType.loadDataSourceAdditionalPropertyValue,
    NgssmDataActionType.setDataSourceAdditionalPropertyValue,
    NgssmDataActionType.updateDataSourceParameter,
    NgssmDataActionType.setDataSourceParameterValidity
  ].forEach((actionType: string) => {
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
              additionalProperties: {}
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
              parameterIsValid: true
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
  });

  describe(`when processing action of type '${NgssmDataActionType.setDataSourceParameter}'`, () => {
    describe('when parameter is not set in action', () => {
      const action = new NgssmSetDataSourceParameterAction('data-providers');

      beforeEach(() => {
        state = updateNgssmDataState(state, {
          dataSourceValues: {
            ['data-providers']: {
              $set: {
                status: NgssmDataSourceValueStatus.loading,
                value: ['test'],
                lastLoadingDate: DateTime.fromISO('2023-12-18T12:34:00Z'),
                parameter: 'testing',
                additionalProperties: {}
              }
            }
          }
        });
      });

      it(`should reset source value parameter to undefined`, () => {
        const updatedState = reducer.updateState(state, action);
        expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameter).toBeUndefined();
      });

      it(`should set source value valueOutdated to true`, () => {
        const updatedState = reducer.updateState(state, action);
        expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.valueOutdated).toBeTrue();
      });
    });

    describe('when parameter is set in action', () => {
      const action = new NgssmSetDataSourceParameterAction('data-providers', 'new parameter');

      beforeEach(() => {
        state = updateNgssmDataState(state, {
          dataSourceValues: {
            ['data-providers']: {
              $set: {
                status: NgssmDataSourceValueStatus.loading,
                value: ['test'],
                lastLoadingDate: DateTime.fromISO('2023-12-18T12:34:00Z'),
                parameter: 'testing',
                additionalProperties: {}
              }
            }
          }
        });
      });

      it(`should update source value parameter with the value set in action`, () => {
        const updatedState = reducer.updateState(state, action);
        expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameter).toEqual('new parameter');
      });

      it(`should set source value valueOutdated to true`, () => {
        const updatedState = reducer.updateState(state, action);
        expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.valueOutdated).toBeTrue();
      });

      it(`should not set source value valueOutdated to true when doNotMarkParameterAsModified is set to true`, () => {
        const updatedState = reducer.updateState(
          state,
          new NgssmSetDataSourceParameterAction('data-providers', 'new parameter', undefined, true)
        );
        expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.valueOutdated).toBeFalse();
      });
    });

    it(`should update source value parameter validity with the value set in action`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              value: ['test'],
              lastLoadingDate: DateTime.fromISO('2023-12-18T12:34:00Z'),
              parameter: 'testing',
              additionalProperties: {}
            }
          }
        }
      });

      const action = new NgssmSetDataSourceParameterAction('data-providers', 'new parameter', false);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameterIsValid).toEqual(false);
    });
  });

  describe(`when processing action of type '${NgssmDataActionType.updateDataSourceParameter}'`, () => {
    const action = new NgssmUpdateDataSourceParameterAction('data-providers', {
      onlyLast: false,
      description: 'something'
    });

    beforeEach(() => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              value: ['test'],
              lastLoadingDate: DateTime.fromISO('2023-12-18T12:34:00Z'),
              parameter: {
                label: 'testing',
                onlyLast: true
              },
              additionalProperties: {},
              valueOutdated: false
            }
          }
        }
      });
    });

    it(`should merge source value parameter with value set in action`, () => {
      const updatedState = reducer.updateState(state, action);
      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameter).toEqual({
        label: 'testing',
        onlyLast: false,
        description: 'something'
      });
    });

    it(`should should set source value valueOutdated to true`, () => {
      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.valueOutdated).toBeTrue();
    });
  });

  describe(`when processing action of type '${NgssmDataActionType.setDataSourceParameterValidity}'`, () => {
    it(`should update source value parameter validity with the value set in action`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              value: ['test'],
              lastLoadingDate: DateTime.fromISO('2023-12-18T12:34:00Z'),
              parameter: 'testing',
              additionalProperties: {},
              parameterIsValid: true
            }
          }
        }
      });

      const action = new NgssmSetDataSourceParameterValidityAction('data-providers', false);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameterIsValid).toEqual(false);
    });
  });

  describe(`when processing action of type '${NgssmDataActionType.loadDataSourceAdditionalPropertyValue}'`, () => {
    it(`should add property into state when property does not exist`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              additionalProperties: {}
            }
          }
        }
      });

      const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-providers', 'testing');

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties).toEqual({
        testing: {
          status: NgssmDataSourceValueStatus.loading
        }
      });
    });

    [NgssmDataSourceValueStatus.error, NgssmDataSourceValueStatus.loading, NgssmDataSourceValueStatus.none].forEach((status) => {
      it(`should set the property status to ${NgssmDataSourceValueStatus.loading} when it is ${status}`, () => {
        state = updateNgssmDataState(state, {
          dataSourceValues: {
            ['data-providers']: {
              $set: {
                status: NgssmDataSourceValueStatus.loading,
                additionalProperties: {
                  testing: {
                    status
                  }
                }
              }
            }
          }
        });

        const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-providers', 'testing');

        const updatedState = reducer.updateState(state, action);

        expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties).toEqual({
          testing: {
            status: NgssmDataSourceValueStatus.loading
          }
        });
      });
    });

    it(`should not update the property status when it is ${NgssmDataSourceValueStatus.loaded} and action does not force reload`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              additionalProperties: {
                testing: {
                  status: NgssmDataSourceValueStatus.loaded
                }
              }
            }
          }
        }
      });

      const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-providers', 'testing');

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties).toEqual({
        testing: {
          status: NgssmDataSourceValueStatus.loaded
        }
      });
    });

    it(`should not update the property status to ${NgssmDataSourceValueStatus.loading} when it is ${NgssmDataSourceValueStatus.loaded} and action forces reload`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              additionalProperties: {
                testing: {
                  status: NgssmDataSourceValueStatus.loaded
                }
              }
            }
          }
        }
      });

      const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-providers', 'testing', true);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties).toEqual({
        testing: {
          status: NgssmDataSourceValueStatus.loading
        }
      });
    });

    it(`should not reset the value when the value is already set`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              additionalProperties: {
                testing: {
                  status: NgssmDataSourceValueStatus.loaded,
                  value: 'testing'
                }
              }
            }
          }
        }
      });

      const action = new NgssmLoadDataSourceAdditionalPropertyValueAction('data-providers', 'testing', true);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties).toEqual({
        testing: {
          status: NgssmDataSourceValueStatus.loading,
          value: 'testing'
        }
      });
    });
  });

  describe('when processing action of type NgssmDataActionType.setDataSourceAdditionalPropertyValue', () => {
    it(`should update the state with the value set in action when additional property exists in state`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              additionalProperties: {
                testing: {
                  status: NgssmDataSourceValueStatus.loaded,
                  value: {
                    label: 'for testing'
                  }
                }
              }
            }
          }
        }
      });

      const now = DateTime.now();
      spyOn(DateTime, 'now').and.returnValue(now);

      const action = new NgssmSetDataSourceAdditionalPropertyValueAction('data-providers', 'testing', NgssmDataSourceValueStatus.loaded, {
        title: 'to test update'
      });

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties).toEqual({
        testing: {
          status: NgssmDataSourceValueStatus.loaded,
          value: {
            title: 'to test update'
          },
          lastLoadingDate: now
        }
      });
    });

    it(`should update the state with the value set in action when additional property does not exist in state`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              additionalProperties: {}
            }
          }
        }
      });

      const now = DateTime.now();
      spyOn(DateTime, 'now').and.returnValue(now);

      const action = new NgssmSetDataSourceAdditionalPropertyValueAction('data-providers', 'testing', NgssmDataSourceValueStatus.loaded, {
        title: 'to test update'
      });

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers'].additionalProperties).toEqual({
        testing: {
          status: NgssmDataSourceValueStatus.loaded,
          value: {
            title: 'to test update'
          },
          lastLoadingDate: now
        }
      });
    });
  });
});
