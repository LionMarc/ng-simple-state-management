import { RemoteCallError } from './remote-call-error';

export interface RemoteDataGetterParams<TData = unknown> {
  serviceParams: TData;
  callbackAction?: string;
  errorNotificationMessage?: (remoteCallError?: RemoteCallError) => string;
}
