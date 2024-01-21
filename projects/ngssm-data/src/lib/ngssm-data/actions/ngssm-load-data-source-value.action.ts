import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';
import { NgssmDataActionType } from './ngssm-data-action-type';

export class NgssmLoadDataSourceValueAction<TParameter = any> extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly forceReload?: boolean,
    public readonly parameter?: { value?: TParameter }
  ) {
    super(NgssmDataActionType.loadDataSourceValue, key);
  }
}
