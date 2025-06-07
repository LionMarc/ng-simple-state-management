import { State } from 'ngssm-store';

import { NgssmDataSourceAdditionalPropertyValue, NgssmDataSourceValue, NgssmDataSourceValueStatus } from './model';
import { selectNgssmDataState } from './state/ngssm-data.state';

export const selectNgssmDataSourceValue = <TDataType = unknown, TParameter = unknown>(
  state: State,
  key: string
): NgssmDataSourceValue<TDataType, TParameter> => {
  return (selectNgssmDataState(state).dataSourceValues[key] ?? {
    status: NgssmDataSourceValueStatus.notRegistered
  }) as NgssmDataSourceValue<TDataType, TParameter>;
};

export const selectNgssmDataSourceAdditionalPropertyValue = <TProperty = unknown>(
  state: State,
  key: string,
  property: string
): NgssmDataSourceAdditionalPropertyValue<TProperty> => {
  return (selectNgssmDataState(state).dataSourceValues[key]?.additionalProperties[property] ?? {
    status: NgssmDataSourceValueStatus.notRegistered
  }) as NgssmDataSourceAdditionalPropertyValue<TProperty>;
};

/**
 * Returns true if the specified data source is currently loading, false otherwise.
 * @param state The global application state.
 * @param dataSourceKey The unique key of the data source.
 */
export const isNgssmDataSourceLoading = (state: State, dataSourceKey: string): boolean =>
  selectNgssmDataSourceValue(state, dataSourceKey)?.status === NgssmDataSourceValueStatus.loading;
