import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';
import { NgssmDataActionType } from './ngssm-data-action-type';

export class NgssmClearDataSourceAdditionalPropertyValueAction extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly property: string
  ) {
    super(NgssmDataActionType.clearDataSourceAdditionalPropertyValue, key);
  }
}
