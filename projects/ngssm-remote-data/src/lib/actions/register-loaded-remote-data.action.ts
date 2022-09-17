import { Action } from 'ngssm-store';

import { DataStatus } from '../data-status';
import { RemoteDataActionType } from './remote-data-action-type';

export class RegisterLoadedRemoteDataAction implements Action {
  public readonly type: string = RemoteDataActionType.registerLoadedRemoteData;

  constructor(
    public readonly remoteDataKey: string,
    public readonly status: DataStatus,
    public readonly data: any,
    public readonly message?: string
  ) {}
}
