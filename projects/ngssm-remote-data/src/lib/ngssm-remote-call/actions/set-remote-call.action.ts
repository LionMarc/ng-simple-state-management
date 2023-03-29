import { Action } from 'ngssm-store';
import { RemoteCall } from '../model';
import { NgssmRemoteCallActionType } from './ngssm-remote-call-action-type';

export class SetRemoteCallAction implements Action {
  public readonly type: string = NgssmRemoteCallActionType.setRemoteCall;

  constructor(public readonly remoteCallId: string, public readonly remoteCall: RemoteCall) {}
}
