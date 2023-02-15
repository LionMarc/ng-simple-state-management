import { Action } from 'ngssm-store';

import { ReloadParams } from '../model';
import { RemoteDataActionType } from './remote-data-action-type';

export class LoadRemoteDataAction<TValue = any> implements Action {
  public readonly type: string = RemoteDataActionType.loadRemoteData;

  constructor(public readonly remoteDataKey: string, public readonly params?: ReloadParams<TValue>) {}
}
