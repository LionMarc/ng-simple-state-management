import { HttpErrorResponse } from '@angular/common/http';
import { DateTime } from 'luxon';

/**
 * Enum describing the lifecycle status of a data source value.
 * - none: No value has been requested or initialized.
 * - notRegistered: The requested data source is not registered.
 * - loading: A load operation for the data source is currently in progress.
 * - loaded: The data source loaded successfully and a value is available.
 * - error: The last load attempt failed.
 */
export enum NgssmDataSourceValueStatus {
  none = 'none',
  notRegistered = 'notRegistered',
  loading = 'loading',
  loaded = 'loaded',
  error = 'error'
}

/**
 * Represents the status and optional metadata for an additional property of a data source.
 * Additional properties are values related to the main data source value that may be loaded independently
 * (for example, a row detail).
 *
 * @template TProperty Type of the additional property's value.
 * @property status Current load status of the additional property.
 * @property value Optional value of the additional property.
 * @property lastLoadingDate Optional timestamp of the last successful load (luxon DateTime).
 * @property httpErrorResponse Optional HTTP error returned during the last load attempt.
 */
export interface NgssmDataSourceAdditionalPropertyValue<TProperty = unknown> {
  status: NgssmDataSourceValueStatus;
  value?: TProperty;
  lastLoadingDate?: DateTime;
  httpErrorResponse?: HttpErrorResponse;
}

/**
 * Represents the stored value and metadata for a data source.
 *
 * @template TData Type of the data source value.
 * @template TParameter Type of the parameter used to load the data source.
 * @property status Current load status of the data source.
 * @property value Optional value returned by the data source loader.
 * @property parameter Optional parameter used when loading the data source.
 * @property lastLoadingDate Optional timestamp of the last successful load (luxon DateTime).
 * @property dataLifetimeInSeconds Optional TTL for cached data, in seconds.
 * @property additionalProperties Map of additional property values (see NgssmDataSourceAdditionalPropertyValue).
 * @property parameterIsValid Optional flag indicating if the current parameter is valid.
 * @property parameterPartialValidity Optional map storing partial validity of parameter sub-fields (e.g. { fieldA: true, fieldB: false }).
 * @property httpErrorResponse Optional HTTP error returned during the last load attempt.
 * @property valueOutdated Optional flag indicating that the parameter changed and the value is now outdated.
 */
export interface NgssmDataSourceValue<TData = unknown, TParameter = unknown> {
  status: NgssmDataSourceValueStatus;
  value?: TData;
  parameter?: TParameter;
  lastLoadingDate?: DateTime;
  dataLifetimeInSeconds?: number;
  additionalProperties: Record<string, NgssmDataSourceAdditionalPropertyValue>;
  parameterIsValid?: boolean;

  /**
   * Map storing partial validity information for the parameter.
   * Key is a parameter field name (or any identifier) and value is boolean validity.
   * Undefined when no partial validation data is present.
   */
  parameterPartialValidity?: Record<string, boolean>;

  httpErrorResponse?: HttpErrorResponse;

  // Parameter has been updated but not value
  valueOutdated?: boolean;
}

/**
 * Types and helper for automatic reload intervals of a data source value.
 * - NgssmDataSourceValueAutoReloadType: allowed string values for auto-reload selection.
 * - getNgssmDataSourceValueAutoReloadTypes: returns a list of label/value pairs usable for UI selects.
 */
export type NgssmDataSourceValueAutoReloadType = 'Off' | '1min' | '5min' | '15min';
export const getNgssmDataSourceValueAutoReloadTypes = (): { label: string; value: NgssmDataSourceValueAutoReloadType }[] => [
  { label: 'Off', value: 'Off' },
  { label: 'Every minute', value: '1min' },
  { label: 'Every 5 minutes', value: '5min' },
  { label: 'Every 15 minutes', value: '15min' }
];

export const isNgssmDataSourceValueParameterValid = (dataSourceValue: NgssmDataSourceValue): boolean => {
  if (dataSourceValue.parameterPartialValidity) {
    let isValid = true;
    Object.values(dataSourceValue.parameterPartialValidity).forEach((isPartialValid) => {
      isValid = isValid && isPartialValid;
    });
    return isValid;
  }

  if (dataSourceValue.parameterIsValid === false) {
    return false;
  }

  return true;
};
