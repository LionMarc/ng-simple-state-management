import { State } from 'ngssm-store';
import { getDefaultRemoteCall, RemoteCall } from '../model';
import { selectNgssmRemoteCallState } from './ngssm-remote-call.state';

export const selectRemoteCall = (state: State, id: string): RemoteCall =>
  selectNgssmRemoteCallState(state).remoteCalls[id] ?? getDefaultRemoteCall();
