import { RemoteCallError } from './remote-call-error';
import { RemoteCallStatus } from './remote-call-status';

export interface RemoteCall {
  status: RemoteCallStatus;
  error?: RemoteCallError;
  message?: string;
}

export const getDefaultRemoteCall = (status: RemoteCallStatus = RemoteCallStatus.none): RemoteCall => ({ status });
