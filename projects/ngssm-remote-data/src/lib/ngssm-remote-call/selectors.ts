import { State } from 'ngssm-store';

import { getDefaultRemoteCall, RemoteCall, RemoteCallStatus } from './model';
import { selectNgssmRemoteCallState } from './state/ngssm-remote-call.state';

export const selectRemoteCall = (state: State, id: string): RemoteCall =>
  selectNgssmRemoteCallState(state).remoteCalls[id] ?? getDefaultRemoteCall();

/**
 * Returns true if the specified remote call is currently in progress, false otherwise.
 * @param state The global application state.
 * @param remoteCallId The unique id of the remote call.
 */
export const isNgssmRemoteCallInProgress = (state: State, remoteCallId: string): boolean =>
  selectRemoteCall(state, remoteCallId)?.status === RemoteCallStatus.inProgress;
