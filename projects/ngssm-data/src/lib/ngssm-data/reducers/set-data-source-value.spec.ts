import { HttpErrorResponse } from '@angular/common/http';
import { State } from 'ngssm-store';
import { of } from 'rxjs';

import { NgssmSetDataSourceValueAction } from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';
import { setDataSourceValue } from './set-data-source-value';

describe('setDataSourceValue', () => {
  it('should set value, status, timestamp, and error for a registered source', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: { source: { $set: { status: NgssmDataSourceValueStatus.loading, additionalProperties: {} } } }
      }
    );
    const error = { message: 'failed' } as HttpErrorResponse;

    const updatedState = setDataSourceValue(
      state,
      new NgssmSetDataSourceValueAction('source', NgssmDataSourceValueStatus.error, ['value'], error)
    );

    const value = selectNgssmDataState(updatedState).dataSourceValues['source'];
    expect(value?.status).toBe(NgssmDataSourceValueStatus.error);
    expect(value?.value).toEqual(['value']);
    expect(value?.lastLoadingDate).toBeDefined();
    expect(value?.httpErrorResponse).toBe(error);
  });

  it('should leave state unchanged if the source value is not registered', () => {
    const state = { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState };
    expect(setDataSourceValue(state, new NgssmSetDataSourceValueAction('missing', NgssmDataSourceValueStatus.loaded))).toBe(state);
  });

  it('should recompute linked data sources in the reducer using the updated state', () => {
    const computedValue = vi.fn((state: State) => `computed:${selectNgssmDataState(state).dataSourceValues['source']?.value}`);
    const otherComputedValue = vi.fn((state: State) => `other:${selectNgssmDataState(state).dataSourceValues['source']?.value}`);
    const chainedValue = vi.fn(
      (state: State) =>
        `chained:${selectNgssmDataState(state).dataSourceValues['computed']?.value}:${selectNgssmDataState(state).dataSourceValues['other-computed']?.value}`
    );
    const state: State = {
      [NgssmDataStateSpecification.featureStateKey]: {
        ...NgssmDataStateSpecification.initialState,
        dataSources: {
          source: { key: 'source', dataLoadingFunc: () => of('initial') },
          computed: { key: 'computed', linkedToDataSources: ['source'], computationFunc: computedValue },
          'other-computed': { key: 'other-computed', linkedToDataSource: 'source', computationFunc: otherComputedValue },
          chained: { key: 'chained', linkedToDataSources: ['computed', 'other-computed'], computationFunc: chainedValue }
        },
        dataSourceValues: {
          source: { status: NgssmDataSourceValueStatus.loaded, value: 'initial', additionalProperties: {} },
          computed: { status: NgssmDataSourceValueStatus.none, additionalProperties: {} },
          'other-computed': { status: NgssmDataSourceValueStatus.none, additionalProperties: {} },
          chained: { status: NgssmDataSourceValueStatus.none, additionalProperties: {} }
        }
      }
    };

    const updatedState = setDataSourceValue(
      state,
      new NgssmSetDataSourceValueAction('source', NgssmDataSourceValueStatus.loaded, 'updated')
    );
    const dataState = selectNgssmDataState(updatedState);

    expect(computedValue).toHaveBeenCalledTimes(1);
    expect(otherComputedValue).toHaveBeenCalledTimes(1);
    expect(chainedValue).toHaveBeenCalledTimes(1);
    expect(dataState.dataSourceValues['computed']?.value).toBe('computed:updated');
    expect(dataState.dataSourceValues['other-computed']?.value).toBe('other:updated');
    expect(dataState.dataSourceValues['chained']?.value).toBe('chained:computed:updated:other:updated');
    expect(dataState.dataSourceValues['computed']?.status).toBe(NgssmDataSourceValueStatus.loaded);
    expect(dataState.dataSourceValues['other-computed']?.status).toBe(NgssmDataSourceValueStatus.loaded);
    expect(dataState.dataSourceValues['chained']?.status).toBe(NgssmDataSourceValueStatus.loaded);
  });
});
