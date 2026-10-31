import { NgssmClearDataSourceAdditionalPropertyValueAction } from '../actions';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataStateSpecification, selectNgssmDataState, updateNgssmDataState } from '../state';
import { clearDataSourceAdditionalPropertyValue } from './clear-data-source-additional-property-value';

describe('clearDataSourceAdditionalPropertyValue', () => {
  it('should clear the property and reset its status', () => {
    const state = updateNgssmDataState(
      { [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState },
      {
        dataSourceValues: {
          source: {
            $set: {
              status: NgssmDataSourceValueStatus.loaded,
              additionalProperties: {
                detail: { status: NgssmDataSourceValueStatus.loaded, value: 'cached' }
              }
            }
          }
        }
      }
    );

    const property = selectNgssmDataState(
      clearDataSourceAdditionalPropertyValue(state, new NgssmClearDataSourceAdditionalPropertyValueAction('source', 'detail'))
    ).dataSourceValues['source']?.additionalProperties['detail'];
    expect(property).toEqual({
      status: NgssmDataSourceValueStatus.none,
      value: undefined,
      lastLoadingDate: undefined,
      httpErrorResponse: undefined
    });
  });
});
