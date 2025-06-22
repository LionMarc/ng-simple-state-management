import { Action } from 'ngssm-store';

import { RemoteCall } from './remote-call';

export enum NgssmRemoteCallActionType {
  setRemoteCall = '[NgssmRemoteCallActionType] setRemoteCall'
}

export class SetRemoteCallAction implements Action {
  public readonly type: string = NgssmRemoteCallActionType.setRemoteCall;

  constructor(
    public readonly remoteCallId: string,
    public readonly remoteCall: RemoteCall
  ) {}
}
