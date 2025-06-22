import { DataStatus } from './data-status';
import { RemoteCallError } from './remote-call-error';
import { RemoteDataGetterParams } from './remote-data-getter-params';

export interface RemoteData<TData = unknown, TGetterParams = unknown> {
  status: DataStatus;
  data?: TData;
  timestamp?: Date;
  message?: string;
  error?: RemoteCallError;
  getterParams?: RemoteDataGetterParams<TGetterParams>;
}

export const getDefaultRemoteData = <T>(defaultValue?: T, defaultStatus: DataStatus = DataStatus.none): RemoteData<T> => ({
  status: defaultStatus,
  data: defaultValue
});
