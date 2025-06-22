import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { Logger, Store } from 'ngssm-store';
import { NgssmNotifierService } from 'ngssm-toolkit';
import { provideNgssmStoreTesting } from 'ngssm-store/testing';

import { RemoteCallResultProcessor } from './remote-call-result-processor';
import { SetRemoteCallAction } from './actions';
import { RemoteCallStatus } from './remote-call';

describe('RemoteCallResultProcessor', () => {
  let service: RemoteCallResultProcessor;
  let logger: Logger;
  let notifier: NgssmNotifierService;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNgssmStoreTesting()]
    });
    service = TestBed.inject(RemoteCallResultProcessor);
    logger = TestBed.inject(Logger);
    notifier = TestBed.inject(NgssmNotifierService);
    store = TestBed.inject(Store);

    spyOn(logger, 'error');
    spyOn(logger, 'information');
    spyOn(notifier, 'notifyError');
    spyOn(notifier, 'notifySuccess');
    spyOn(store, 'dispatchAction');
  });

  describe('processRemoteCallError', () => {
    const httpErrorResponse: HttpErrorResponse = {
      message: 'http error'
    } as unknown as HttpErrorResponse;

    beforeEach(() => {
      service.processRemoteCallError('my-id', httpErrorResponse, 'wrong call');
    });

    it(`should log an error message`, () => {
      expect(logger.error).toHaveBeenCalledWith('wrong call', {
        message: 'http error'
      } as unknown as HttpErrorResponse);
    });

    it(`should notify the error`, () => {
      expect(notifier.notifyError).toHaveBeenCalledWith('wrong call: http error');
    });

    it(`should dispatch an action to update the status of the remote call`, () => {
      expect(store.dispatchAction).toHaveBeenCalledWith(
        new SetRemoteCallAction('my-id', {
          status: RemoteCallStatus.ko,
          httpErrorResponse: {
            message: 'http error'
          } as unknown as HttpErrorResponse,
          message: 'wrong call'
        })
      );
    });
  });

  describe('processRemoteCallSuccess', () => {
    beforeEach(() => {
      service.processRemoteCallSuccess('my-id', 'action done');
    });

    it(`should log an information`, () => {
      expect(logger.information).toHaveBeenCalledWith('action done');
    });

    it(`should notify the success`, () => {
      expect(notifier.notifySuccess).toHaveBeenCalledWith('action done');
    });

    it(`should dispatch an action to update the status of the remote call`, () => {
      expect(store.dispatchAction).toHaveBeenCalledWith(
        new SetRemoteCallAction('my-id', {
          status: RemoteCallStatus.done
        })
      );
    });
  });
});
