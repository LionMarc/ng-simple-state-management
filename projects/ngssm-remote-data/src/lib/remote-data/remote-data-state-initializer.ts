import { Inject, Injectable, Optional } from '@angular/core';

import { State, StateInitializer } from 'ngssm-store';

import { DataStatus, RemoteDataProvider, NGSSM_REMOTE_DATA_PROVIDER } from './model';
import { updateRemoteDataState } from './state';

@Injectable()
export class RemoteDataStateInitializer implements StateInitializer {
  constructor(@Inject(NGSSM_REMOTE_DATA_PROVIDER) @Optional() private remoteDataProviders: RemoteDataProvider[]) {}

  public initializeState(state: State): State {
    const tempState = state;
    return (this.remoteDataProviders ?? []).reduce(
      (s, provider) => updateRemoteDataState(s, { [provider.remoteDataKey]: { $set: { status: DataStatus.none } } }),
      tempState
    );
  }
}
