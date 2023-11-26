import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';
import { NgssmDataActionType } from './ngssm-data-action-type';

export class NgssmLoadDataSourceValueAction extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly forceReload?: boolean
  ) {
    super(NgssmDataActionType.loadDataSourceValue, key);
  }
}
