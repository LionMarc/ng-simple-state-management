import { inject, Injectable } from '@angular/core';

import { RemoteCallError, RemoteCallStatus, updateNgssmRemoteCallState } from 'ngssm-remote-data';
import { Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

@Injectable()
export class NgssmRemoteCallSetter {
  public readonly store = inject(Store) as unknown as StoreMock;

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

  public setRemoteCallError(remoteCallId: string, error?: RemoteCallError): NgssmRemoteCallSetter {
    this.store.stateValue = updateNgssmRemoteCallState(this.store.stateValue, {
      remoteCalls: {
        [remoteCallId]: {
          error: { $set: error }
        }
      }
    });

    return this;
  }
}
