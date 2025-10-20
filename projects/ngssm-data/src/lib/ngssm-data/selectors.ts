import { State } from 'ngssm-store';

import {
  isNgssmDataSourceValueParameterValid,
  NgssmDataSourceAdditionalPropertyValue,
  NgssmDataSourceValue,
  NgssmDataSourceValueStatus
} from './model';
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

/**
 * Determines whether the parameter for the specified data source should be considered valid.
 *
 * Rules:
 * - If parameterIsValid is explicitly true or false on the data source value, that value is returned.
 * - Otherwise, if parameterPartialValidity map exists, the function returns true only if all
 *   partial entries are true (logical AND).
 * - If no explicit validity information is present, the parameter is considered valid (returns true).
 *
 * @param state The global application state.
 * @param dataSourceKey The key of the data source to check.
 * @returns True when the parameter (or all partial parameter entries) is valid, false otherwise.
 */
export const isNgssmDataSourceParameterValid = (state: State, dataSourceKey: string): boolean => {
  const dataSource = selectNgssmDataSourceValue(state, dataSourceKey);
  if (!dataSource) {
    return true;
  }

  return isNgssmDataSourceValueParameterValid(dataSource);
};
