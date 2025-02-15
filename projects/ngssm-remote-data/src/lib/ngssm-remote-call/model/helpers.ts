import { HttpErrorResponse } from '@angular/common/http';

import { ActionDispatcher, Logger } from 'ngssm-store';
import { NgssmNotifierService } from 'ngssm-toolkit';

import { RemoteCallError } from './remote-call-error';
import { SetRemoteCallAction } from '../actions';
import { RemoteCallStatus } from './remote-call-status';

export const processRemoteCallError = (
  error: HttpErrorResponse,
  errorMessage: string,
  remoteCallId: string,
  actionDispatcher: ActionDispatcher,
  logger: Logger,
  notifier: NgssmNotifierService
): void => {
  const serviceError: RemoteCallError | undefined = error.error;
  logger.error(errorMessage, error);
  notifier.notifyError(`${errorMessage}: ${serviceError?.title}`);
  actionDispatcher.dispatchAction(new SetRemoteCallAction(remoteCallId, { status: RemoteCallStatus.ko, error: serviceError }));
};
