import { RemoteCallError } from '../../ngssm-remote-call/model';

export interface RemoteDataGetterParams<TData = any> {
  serviceParams: TData;
  callbackAction?: string;
  errorNotificationMessage?: (remoteCallError?: RemoteCallError) => string;
}
