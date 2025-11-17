import { State } from 'ngssm-store';

import { DateTime } from 'luxon';

import {
  NgssmDataActionType,
  NgssmSetDataSourceParameterAction,
  NgssmSetDataSourceParameterValidityAction,
  NgssmUpdateDataSourceParameterAction
} from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';
import { DataSourceParameterReducer } from './data-source-parameter.reducer';

describe('DataSourceParameterReducer', () => {
  let reducer: DataSourceParameterReducer;
  let state: State;

  beforeEach(() => {
    reducer = new DataSourceParameterReducer();
    state = {
      [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
    };
  });

  [
    NgssmDataActionType.setDataSourceParameter,
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
                additionalProperties: {},
                parameterPartialValidity: {
                  testing: true
                }
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

      it(`should not modify the parameter partial validity record`, () => {
        const updatedState = reducer.updateState(state, action);
        expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameterPartialValidity).toEqual({
          testing: true
        });
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
                additionalProperties: {},
                parameterPartialValidity: {}
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
              additionalProperties: {},
              parameterPartialValidity: {}
            }
          }
        }
      });

      const action = new NgssmSetDataSourceParameterAction('data-providers', 'new parameter', false);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameterIsValid).toEqual(false);
    });

    it(`should not modify the parameter partial validity record`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              value: ['test'],
              lastLoadingDate: DateTime.fromISO('2023-12-18T12:34:00Z'),
              parameter: 'testing',
              additionalProperties: {},
              parameterPartialValidity: {
                testing: true
              }
            }
          }
        }
      });

      const action = new NgssmSetDataSourceParameterAction('data-providers', 'new parameter', false);

      const updatedState = reducer.updateState(state, action);
      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameterPartialValidity).toEqual({
        testing: true
      });
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
              valueOutdated: false,
              parameterPartialValidity: {
                testing: true
              }
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

    it(`should set source value valueOutdated to true`, () => {
      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.valueOutdated).toBeTrue();
    });

    it(`should not set source value valueOutdated to true when doNotMarkParameterAsModified is set to true`, () => {
      const updatedState = reducer.updateState(
        state,
        new NgssmUpdateDataSourceParameterAction(
          'data-providers',
          {
            onlyLast: false,
            description: 'something'
          },
          true
        )
      );
      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.valueOutdated).toBeFalse();
    });

    it(`should not modify the parameter partial validity record`, () => {
      const updatedState = reducer.updateState(state, action);
      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameterPartialValidity).toEqual({
        testing: true
      });
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
              parameterIsValid: true,
              parameterPartialValidity: {}
            }
          }
        }
      });

      const action = new NgssmSetDataSourceParameterValidityAction('data-providers', false);

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameterIsValid).toEqual(false);
    });

    it(`should update the partial validity when key is not yet in parameterPartialValidity record`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              value: ['test'],
              lastLoadingDate: DateTime.fromISO('2023-12-18T12:34:00Z'),
              parameter: 'testing',
              additionalProperties: {},
              parameterIsValid: true,
              parameterPartialValidity: {
                test: true
              }
            }
          }
        }
      });

      const action = new NgssmSetDataSourceParameterValidityAction('data-providers', false, 'instrument');

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameterPartialValidity).toEqual({
        test: true,
        instrument: false
      });
    });

    it(`should update the partial validity when key is in parameterPartialValidity record`, () => {
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              value: ['test'],
              lastLoadingDate: DateTime.fromISO('2023-12-18T12:34:00Z'),
              parameter: 'testing',
              additionalProperties: {},
              parameterIsValid: true,
              parameterPartialValidity: {
                test: true,
                instrument: true
              }
            }
          }
        }
      });

      const action = new NgssmSetDataSourceParameterValidityAction('data-providers', false, 'instrument');

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameterPartialValidity).toEqual({
        test: true,
        instrument: false
      });
    });

    it(`should update the partial validity when parameterPartialValidity record is not set`, () => {
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

      const action = new NgssmSetDataSourceParameterValidityAction('data-providers', true, 'instrument');

      const updatedState = reducer.updateState(state, action);

      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameterPartialValidity).toEqual({
        instrument: true
      });
    });

    it(`should clear all partial validities when clearPartialValidities is true`, () => {
      // Arrange: state with existing partial validities
      state = updateNgssmDataState(state, {
        dataSourceValues: {
          ['data-providers']: {
            $set: {
              status: NgssmDataSourceValueStatus.loading,
              value: ['test'],
              lastLoadingDate: DateTime.fromISO('2023-12-18T12:34:00Z'),
              parameter: 'testing',
              additionalProperties: {},
              parameterIsValid: true,
              parameterPartialValidity: {
                fieldA: true,
                fieldB: false
              }
            }
          }
        }
      });

      // Act: dispatch action asking to set overall validity and clear partial validities
      const action = new NgssmSetDataSourceParameterValidityAction('data-providers', false, undefined, true);
      const updatedState = reducer.updateState(state, action);

      // Assert: partial validities have been cleared (empty object)
      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameterPartialValidity).toEqual(undefined);
      // And overall validity has been updated
      expect(selectNgssmDataState(updatedState).dataSourceValues['data-providers']?.parameterIsValid).toEqual(false);
    });
  });
});
