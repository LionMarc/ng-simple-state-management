import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';
import { NgssmDataActionType } from './ngssm-data-action-type';

export class NgssmClearDataSourceValueAction extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly clearParameter: boolean = false
  ) {
    super(NgssmDataActionType.clearDataSourceValue, key);
  }
}
