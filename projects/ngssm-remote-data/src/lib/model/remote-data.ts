import { DataStatus } from './data-status';

export interface RemoteData<T> {
  status: DataStatus;
  data?: T;
  timestamp?: Date;
  message?: string;
}

export const getDefaultRemoteData = <T>(defaultValue?: T): RemoteData<T> => ({
  status: DataStatus.none,
  data: defaultValue
});
