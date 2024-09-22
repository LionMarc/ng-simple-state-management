import { DateTime } from 'luxon';

export enum NgssmDataSourceValueStatus {
  none = 'none',
  notRegistered = 'notRegistered',
  loading = 'loading',
  loaded = 'loaded',
  error = 'error'
}

export interface NgssmDataSourceAdditionalPropertyValue<TProperty = any> {
  status: NgssmDataSourceValueStatus;
  value?: TProperty;
  lastLoadingDate?: DateTime;
}

export interface NgssmDataSourceValue<TData = any, TParameter = any> {
  status: NgssmDataSourceValueStatus;
  value?: TData;
  parameter?: TParameter;
  lastLoadingDate?: DateTime;
  dataLifetimeInSeconds?: number;
  additionalProperties: { [key: string]: NgssmDataSourceAdditionalPropertyValue };
  parameterIsValid?: boolean;
}
