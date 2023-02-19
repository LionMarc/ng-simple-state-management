import { Action } from 'ngssm-store';

import { RemoteCallError } from '../../ngssm-remote-call/model';
import { DataStatus } from '../model';
import { RemoteDataActionType } from './remote-data-action-type';

export class RegisterLoadedRemoteDataAction implements Action {
  public readonly type: string = RemoteDataActionType.registerLoadedRemoteData;

  constructor(
    public readonly remoteDataKey: string,
    public readonly status: DataStatus,
    public readonly data: any,
    public readonly message?: string,
    public readonly remoteCallError?: RemoteCallError
  ) {}
}
