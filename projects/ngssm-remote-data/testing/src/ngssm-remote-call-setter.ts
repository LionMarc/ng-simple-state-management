import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { getDefaultRemoteCall, RemoteCallStatus, updateNgssmRemoteCallState } from 'ngssm-remote-data';
import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

/**
 * Utility service for setting and updating remote call status and errors in the StoreMock during tests.
 * Provides methods to set the status or error of a remote call.
 */
@Injectable()
export class NgssmRemoteCallSetter {
  public readonly store = inject(Store) as unknown as StoreMock;

  /**
   * Initializes the given remote call in the state.
   * @param remoteCallId The identifier of the remote call
   * @returns The NgssmRemoteCallSetter instance for chaining.
   */
  public initRemoteCall(remoteCallId: string): NgssmRemoteCallSetter {
    this.store.stateValue = updateNgssmRemoteCallState(this.store.stateValue, {
      remoteCalls: {
        [remoteCallId]: {
          $set: getDefaultRemoteCall()
        }
      }
    });

    return this;
  }

  /**
   * Sets the status of a remote call in the StoreMock.
   * @param remoteCallId The identifier of the remote call.
   * @param status The new status to set.
   * @returns The NgssmRemoteCallSetter instance for chaining.
   */
  public setRemoteCallStatus(remoteCallId: string, status: RemoteCallStatus): NgssmRemoteCallSetter {
    this.store.stateValue = updateNgssmRemoteCallState(this.store.stateValue, {
      remoteCalls: {
        [remoteCallId]: {
          status: { $set: status }
        }
      }
    });

    return this;
  }

  /**
   * Sets the error of a remote call in the StoreMock.
   * @param remoteCallId The identifier of the remote call.
   * @param error The error to set (optional).
   * @returns The NgssmRemoteCallSetter instance for chaining.
   */
  public setRemoteCallError(remoteCallId: string, error?: HttpErrorResponse): NgssmRemoteCallSetter {
    this.store.stateValue = updateNgssmRemoteCallState(this.store.stateValue, {
      remoteCalls: {
        [remoteCallId]: {
          httpErrorResponse: { $set: error }
        }
      }
    });

    return this;
  }
}

export const ngssmRemoteCallSetter = () => TestBed.inject(NgssmRemoteCallSetter);
