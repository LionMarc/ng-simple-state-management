import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';
import { NgssmDataActionType } from './ngssm-data-action-type';

export class NgssmLoadDataSourceValueAction extends NgssmDataSourceValueAction {
  constructor(key: string) {
    super(NgssmDataActionType.loadDataSourceValue, key);
  }
}
