import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';
import { NgssmDataActionType } from './ngssm-data-action-type';
import { NgssmDataSourceValueStatus } from '../model';

export class NgssmSetDataSourceValueAction<TData = unknown> extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly status: NgssmDataSourceValueStatus,
    public readonly value?: TData
  ) {
    super(NgssmDataActionType.setDataSourceValue, key);
  }
}
