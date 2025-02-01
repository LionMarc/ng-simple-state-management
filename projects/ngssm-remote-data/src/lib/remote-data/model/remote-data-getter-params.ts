import { RemoteCallError } from '../../ngssm-remote-call/model';

export interface RemoteDataGetterParams<TData = unknown> {
  serviceParams: TData;
  callbackAction?: string;
  errorNotificationMessage?: (remoteCallError?: RemoteCallError) => string;
}
