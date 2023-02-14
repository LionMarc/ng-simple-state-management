import { RemoteCallError } from './remote-call-error';

export interface RemoteDataGetterParams<TData = any> {
  serviceParams: TData;
  callbackAction?: string;
  errorNotificationMessage?: (remoteCallError?: RemoteCallError) => string;
}
