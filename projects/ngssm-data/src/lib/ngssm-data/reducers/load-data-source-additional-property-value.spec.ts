import { NgssmLoadDataSourceAdditionalPropertyValueAction } from '../actions';
import { NgssmComputedDataSource, NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';
import { loadDataSourceAdditionalPropertyValue } from './load-data-source-additional-property-value';

describe('loadDataSourceAdditionalPropertyValue', () => {
  it('should not load an additional property for a computed data source', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSources: {
          computed: {
            $set: { key: 'computed', linkedToDataSource: 'source', computationFunc: () => 'computed' } as NgssmComputedDataSource
          }
        },
        dataSourceValues: {
          computed: { $set: { status: NgssmDataSourceValueStatus.loaded, additionalProperties: {} } }
        }
      }
    );

    expect(loadDataSourceAdditionalPropertyValue(state, new NgssmLoadDataSourceAdditionalPropertyValueAction('computed', 'detail'))).toBe(
      state
    );
  });

  it('should mark a new property as loading', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: { $set: { status: NgssmDataSourceValueStatus.loaded, additionalProperties: {} } }
        }
      }
    );

    const updatedState = loadDataSourceAdditionalPropertyValue(
      state,
      new NgssmLoadDataSourceAdditionalPropertyValueAction('source', 'detail')
    );
    expect(selectNgssmDataState(updatedState).dataSourceValues['source']?.additionalProperties['detail']).toEqual({
      status: NgssmDataSourceValueStatus.loading
    });
  });

  it('should keep a loaded property unless force reload is requested', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              additionalProperties: { detail: { status: NgssmDataSourceValueStatus.loaded, value: 'cached' } }
            }
          }
        }
      }
    );

    expect(loadDataSourceAdditionalPropertyValue(state, new NgssmLoadDataSourceAdditionalPropertyValueAction('source', 'detail'))).toBe(
      state
    );
    const updatedState = loadDataSourceAdditionalPropertyValue(
      state,
      new NgssmLoadDataSourceAdditionalPropertyValueAction('source', 'detail', true)
    );
    expect(selectNgssmDataState(updatedState).dataSourceValues['source']?.additionalProperties['detail']?.status).toBe(
      NgssmDataSourceValueStatus.loading
    );
  });

  [NgssmDataSourceValueStatus.error, NgssmDataSourceValueStatus.loading, NgssmDataSourceValueStatus.none].forEach((status) => {
    it(`should mark a property with status ${status} as loading`, () => {
      const state = updateNgssmDataState(
        { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
        {
          dataSourceValues: {
            source: {
              $set: {
                status: NgssmDataSourceValueStatus.loaded,
                additionalProperties: { detail: { status } }
              }
            }
          }
        }
      );

      const updatedState = loadDataSourceAdditionalPropertyValue(
        state,
        new NgssmLoadDataSourceAdditionalPropertyValueAction('source', 'detail')
      );
      expect(selectNgssmDataState(updatedState).dataSourceValues['source']?.additionalProperties['detail']?.status).toBe(
        NgssmDataSourceValueStatus.loading
      );
    });
  });

  it('should retain the value while marking a loaded property as loading for a forced reload', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              additionalProperties: { detail: { status: NgssmDataSourceValueStatus.loaded, value: 'cached' } }
            }
          }
        }
      }
    );

    const updatedState = loadDataSourceAdditionalPropertyValue(
      state,
      new NgssmLoadDataSourceAdditionalPropertyValueAction('source', 'detail', true)
    );
    expect(selectNgssmDataState(updatedState).dataSourceValues['source']?.additionalProperties['detail']).toEqual({
      status: NgssmDataSourceValueStatus.loading,
      value: 'cached'
    });
  });
});
