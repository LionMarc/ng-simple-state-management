import { Action } from 'ngssm-store';
import { RemoteCall } from '../model';

export class NgssmRemoteCallResultAction implements Action {
  constructor(public readonly type: string, public readonly remoteCall: RemoteCall) {}
}
