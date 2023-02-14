import { DataStatus } from './data-status';
import { RemoteCallError } from './remote-call-error';

export interface RemoteData<T> {
  status: DataStatus;
  data?: T;
  timestamp?: Date;
  message?: string;
  error?: RemoteCallError;
}

export const getDefaultRemoteData = <T>(defaultValue?: T): RemoteData<T> => ({
  status: DataStatus.none,
  data: defaultValue
});
