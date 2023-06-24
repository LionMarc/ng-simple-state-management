import { State } from 'ngssm-store';

import { selectRemoteData } from '../remote-data/state';
import { DataStatus } from '../remote-data/model';
import { selectRemoteCall } from '../ngssm-remote-call/state';
import { RemoteCallStatus } from '../ngssm-remote-call/model';

export const atLeastOneLoadingOrInProgress = (state: State, remoteDataKeys: string[], remoteCallIds: string[]): boolean => {
  if (remoteDataKeys.findIndex((key) => selectRemoteData(state, key)?.status === DataStatus.loading) !== -1) {
    return true;
  }

  if (remoteCallIds.findIndex((key) => selectRemoteCall(state, key)?.status === RemoteCallStatus.inProgress) !== -1) {
    return true;
  }

  return false;
};
