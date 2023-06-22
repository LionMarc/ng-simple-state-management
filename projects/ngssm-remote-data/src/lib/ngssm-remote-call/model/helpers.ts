import { HttpErrorResponse } from '@angular/common/http';

import { Logger, Store } from 'ngssm-store';
import { NgssmNotifierService } from 'ngssm-toolkit';

import { RemoteCallError } from './remote-call-error';
import { SetRemoteCallAction } from '../actions';
import { RemoteCallStatus } from './remote-call-status';

export const processRemoteCallError = (
  error: HttpErrorResponse,
  errorMessage: string,
  remoteCallId: string,
  store: Store,
  logger: Logger,
  notifier: NgssmNotifierService
): void => {
  const serviceError: RemoteCallError | undefined = error.error;
  logger.error(errorMessage, error);
  notifier.notifyError(`${errorMessage}: ${serviceError?.title}`);
  store.dispatchAction(new SetRemoteCallAction(remoteCallId, { status: RemoteCallStatus.ko, error: serviceError }));
};
