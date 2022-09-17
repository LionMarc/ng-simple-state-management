import { Action } from 'ngssm-store';

import { RemoteDataActionType } from './remote-data-action-type';

export class LoadRemoteDataAction implements Action {
  public readonly type: string = RemoteDataActionType.loadRemoteData;

  constructor(public readonly remoteDataKey: string, public readonly forceReload: boolean) {}
}
