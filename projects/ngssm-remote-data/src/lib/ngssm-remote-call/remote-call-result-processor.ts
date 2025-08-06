import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector, inject } from '@angular/core';

import { ActionDispatcher, Logger, Store } from 'ngssm-store';
import { NgssmNotifierService } from 'ngssm-toolkit';

import { SetRemoteCallAction } from './actions';
import { RemoteCallStatus } from './remote-call';

@Injectable({
  providedIn: 'root'
})
export class RemoteCallResultProcessor {
  private readonly logger = inject(Logger);

  // Inject Injector instead of Store because Effects are injected into Store and this class may be used by Effects
  private readonly injector = inject(Injector);
  private readonly notifier = inject(NgssmNotifierService);

  public processRemoteCallError(remoteCallId: string, error: HttpErrorResponse, errorMessage: string): void {
    this.logger.error(errorMessage, error);
    this.notifier.notifyError(`${errorMessage}: ${error.message}`);
    this.injector
      .get(Store)
      .dispatchAction(
        new SetRemoteCallAction(remoteCallId, { status: RemoteCallStatus.ko, httpErrorResponse: error, message: errorMessage })
      );
  }

  public processRemoteCallSuccess(remoteCallId: string, message: string): void {
    this.logger.information(message);
    this.notifier.notifySuccess(message);
    this.injector.get(Store).dispatchAction(new SetRemoteCallAction(remoteCallId, { status: RemoteCallStatus.done }));
  }
}

/**
 * Helper method to process http error.
 *
 * Use instead the service RemoteCallResultProcessor.
 *
 * @param error The http error response.
 * @param errorMessage The custom error message.
 * @param remoteCallId The remote call identifier.
 * @param actionDispatcher The action dispatcher.
 * @param logger The logger.
 * @param notifier The message notifier.
 */
export const processRemoteCallError = (
  error: HttpErrorResponse,
  errorMessage: string,
  remoteCallId: string,
  actionDispatcher: ActionDispatcher,
  logger: Logger,
  notifier: NgssmNotifierService
): void => {
  logger.error(errorMessage, error);
  notifier.notifyError(`${errorMessage}: ${error.error?.title}`);
  actionDispatcher.dispatchAction(new SetRemoteCallAction(remoteCallId, { status: RemoteCallStatus.ko, error: error.error }));
};
