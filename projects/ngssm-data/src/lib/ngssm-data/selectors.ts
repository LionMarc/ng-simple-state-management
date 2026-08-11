import { State } from 'ngssm-store';

import {
  isNgssmDataSourceValueParameterValid,
  NgssmDataSourceAdditionalPropertyValue,
  NgssmDataSourceValue,
  NgssmDataSourceValueStatus
} from './model';
import { selectNgssmDataState } from './state/ngssm-data.state';

export type NgssmDataSourceLoadingCheckType = 'none' | 'selected' | 'allProperties';

export interface NgssmDataSourceLoadingAdditionalPropertiesCheck {
  type: NgssmDataSourceLoadingCheckType;
  properties?: string[];
}

export interface NgssmDataSourceLoadingOptions {
  checkLinkedDataSources?: boolean;
  checkAdditionalProperties?: NgssmDataSourceLoadingAdditionalPropertiesCheck;
}

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
 * @param optionsOrCheckLinkedDataSources Either a boolean used for the legacy linked-data-source check,
 *   or an options object that can also verify the status of additional properties.
 */
export const isNgssmDataSourceLoading = (
  state: State,
  dataSourceKey: string,
  optionsOrCheckLinkedDataSources: boolean | NgssmDataSourceLoadingOptions = false
): boolean => {
  const options =
    typeof optionsOrCheckLinkedDataSources === 'boolean'
      ? { checkLinkedDataSources: optionsOrCheckLinkedDataSources }
      : (optionsOrCheckLinkedDataSources ?? {});

  const hasLoadingDataSourceStatus = selectNgssmDataSourceValue(state, dataSourceKey)?.status === NgssmDataSourceValueStatus.loading;
  if (hasLoadingDataSourceStatus) {
    return true;
  }

  const hasLoadingAdditionalProperties = (key: string): boolean => {
    const checkOptions = options.checkAdditionalProperties;
    if (!checkOptions || checkOptions.type === 'none') {
      return false;
    }

    const additionalProperties = selectNgssmDataSourceValue(state, key)?.additionalProperties ?? {};
    const propertyNames = Object.keys(additionalProperties);
    const propertiesToCheck = checkOptions.type === 'selected' ? (checkOptions.properties ?? []) : propertyNames;

    if (propertiesToCheck.length === 0) {
      return false;
    }

    return propertiesToCheck.some((property) => additionalProperties[property]?.status === NgssmDataSourceValueStatus.loading);
  };

  if (hasLoadingAdditionalProperties(dataSourceKey)) {
    return true;
  }

  if (!options.checkLinkedDataSources) {
    return false;
  }

  const dataState = selectNgssmDataState(state);
  const dataSource = dataState.dataSources[dataSourceKey];
  if (!dataSource) {
    return false;
  }

  const linkedDataSourceKeys = new Set<string>(dataSource.linkedDataSources ?? []);
  Object.keys(dataState.dataSources)
    .filter((key) => dataState.dataSources[key].linkedToDataSource === dataSourceKey)
    .forEach((key) => linkedDataSourceKeys.add(key));

  for (const linkedKey of linkedDataSourceKeys) {
    if (
      selectNgssmDataSourceValue(state, linkedKey)?.status === NgssmDataSourceValueStatus.loading ||
      hasLoadingAdditionalProperties(linkedKey)
    ) {
      return true;
    }
  }

  return false;
};

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

/**
 * Throws an Error if the data source value for the given key does not exist in the state.
 *
 * This is a convenience guard used by callers that require the data source value to be present.
 * Use throwIfSourceValueDoesNotExist(state, key) to validate presence before accessing the value.
 *
 * @param state The global application state.
 * @param dataSourceKey The key of the data source to check.
 * @throws Error when the data source value is not present in the state.
 */
export const throwIfSourceValueDoesNotExist = (state: State, dataSourceKey?: string) => {
  if (!dataSourceKey) {
    return;
  }

  const dataSource = selectNgssmDataSourceValue(state, dataSourceKey);
  if (!dataSource || dataSource.status === NgssmDataSourceValueStatus.notRegistered) {
    throw new Error(`Datasource ${dataSourceKey} does not exists.`);
  }
};
