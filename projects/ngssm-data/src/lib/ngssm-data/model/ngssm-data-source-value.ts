export enum NgssmDataSourceValueStatus {
  none = 'none',
  notRegistered = 'notRegistered',
  loading = 'loading',
  loaded = 'loaded',
  error = 'error'
}

export interface NgssmDataSourceValue<TData = any, TParameter = any> {
  status: NgssmDataSourceValueStatus;
  value?: TData;
  parameter?: TParameter;
  lastLoadingDate?: Date;
}
