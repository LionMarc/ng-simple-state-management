import { HttpErrorResponse } from '@angular/common/http';

import { DateTime } from 'luxon';

export enum NgssmDataSourceValueStatus {
  none = 'none',
  notRegistered = 'notRegistered',
  loading = 'loading',
  loaded = 'loaded',
  error = 'error'
}

export interface NgssmDataSourceAdditionalPropertyValue<TProperty = unknown> {
  status: NgssmDataSourceValueStatus;
  value?: TProperty;
  lastLoadingDate?: DateTime;
}

export interface NgssmDataSourceValue<TData = unknown, TParameter = unknown> {
  status: NgssmDataSourceValueStatus;
  value?: TData;
  parameter?: TParameter;
  lastLoadingDate?: DateTime;
  dataLifetimeInSeconds?: number;
  additionalProperties: Record<string, NgssmDataSourceAdditionalPropertyValue>;
  parameterIsValid?: boolean;
  httpErrorResponse?: HttpErrorResponse;

  // Parameter has been updated but not value
  valueOutdated?: boolean;
}

export type NgssmDataSourceValueAutoReloadType = 'Off' | '1min' | '5min' | '15min';
export const getNgssmDataSourceValueAutoReloadTypes = (): { label: string; value: NgssmDataSourceValueAutoReloadType }[] => [
  { label: 'Off', value: 'Off' },
  { label: 'Every minute', value: '1min' },
  { label: 'Every 5 minutes', value: '5min' },
  { label: 'Every 15 minutes', value: '15min' }
];
