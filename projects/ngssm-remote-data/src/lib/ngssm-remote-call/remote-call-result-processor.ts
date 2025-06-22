import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Logger, Store } from 'ngssm-store';
import { NgssmNotifierService } from 'ngssm-toolkit';

import { SetRemoteCallAction } from './actions';
import { RemoteCallStatus } from './remote-call';

@Injectable({
  providedIn: 'root'
})
export class RemoteCallResultProcessor {
  private readonly logger = inject(Logger);
  private readonly store = inject(Store);
  private readonly notifier = inject(NgssmNotifierService);

  public processRemoteCallError(remoteCallId: string, error: HttpErrorResponse, errorMessage: string): void {
    this.logger.error(errorMessage, error);
    this.notifier.notifyError(`${errorMessage}: ${error.message}`);
    this.store.dispatchAction(
      new SetRemoteCallAction(remoteCallId, { status: RemoteCallStatus.failed, httpErrorResponse: error, message: errorMessage })
    );
  }

  public processRemoteCallSuccess(remoteCallId: string, message: string): void {
    this.logger.information(message);
    this.notifier.notifySuccess(message);
    this.store.dispatchAction(new SetRemoteCallAction(remoteCallId, { status: RemoteCallStatus.done }));
  }
}
