import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';
import { NgssmDataSourceValueStatus } from '../model';
import { NgssmDataActionType } from './ngssm-data-action-type';

export class NgssmSetDataSourceAdditionalPropertyValueAction<TProperty = unknown> extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly property: string,
    public readonly status: NgssmDataSourceValueStatus,
    public readonly value?: TProperty,
    public readonly postLoadingAction?: () => void
  ) {
    super(NgssmDataActionType.setDataSourceAdditionalPropertyValue, key);
  }
}
