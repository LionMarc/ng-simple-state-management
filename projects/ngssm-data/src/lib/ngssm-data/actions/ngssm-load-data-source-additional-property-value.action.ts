import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';
import { NgssmDataActionType } from './ngssm-data-action-type';

export class NgssmLoadDataSourceAdditionalPropertyValueAction extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly property: string,
    public readonly forceReload?: boolean
  ) {
    super(NgssmDataActionType.loadDataSourceAdditionalPropertyValue, key);
  }
}
