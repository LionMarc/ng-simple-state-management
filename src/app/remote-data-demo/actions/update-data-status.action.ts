import { DataStatus } from 'ngssm-remote-data';
import { Action } from 'ngssm-store';
import { RemoteDataDemoActionType } from './remote-data-demo-action-type';

export class UpdateDataStatusAction implements Action {
  public readonly type: string = RemoteDataDemoActionType.updateDataStatus;

  constructor(
    public readonly key: string,
    public readonly status: DataStatus
  ) {}
}
