import { Action } from 'ngssm-store';

import { DataStatus, RemoteCallError } from '../model';
import { RemoteDataActionType } from './remote-data-action-type';

export class RegisterLoadedRemoteDataAction<T = unknown> implements Action {
  public readonly type: string = RemoteDataActionType.registerLoadedRemoteData;

  constructor(
    public readonly remoteDataKey: string,
    public readonly status: DataStatus,
    public readonly data: T,
    public readonly message?: string,
    public readonly remoteCallError?: RemoteCallError
  ) {}
}
