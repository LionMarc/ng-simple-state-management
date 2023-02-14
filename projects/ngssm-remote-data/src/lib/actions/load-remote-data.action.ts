import { Action } from 'ngssm-store';

import { RemoteDataGetterParams } from '../model';
import { RemoteDataActionType } from './remote-data-action-type';

export class LoadRemoteDataAction<TValue = any> implements Action {
  public readonly type: string = RemoteDataActionType.loadRemoteData;

  constructor(
    public readonly remoteDataKey: string,
    public readonly forceReload: boolean,
    public readonly params?: RemoteDataGetterParams<TValue>
  ) {}
}
