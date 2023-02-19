import { RemoteCallError } from './remote-call-error';
import { RemoteCallStatus } from './remote-call-status';

export interface RemoteCall {
  status: RemoteCallStatus;
  error?: RemoteCallError;
}

export const getDefaultRemoteCall = (status: RemoteCallStatus = RemoteCallStatus.none): RemoteCall => ({ status });
