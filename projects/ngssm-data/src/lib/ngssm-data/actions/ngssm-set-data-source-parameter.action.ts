import { NgssmDataActionType } from './ngssm-data-action-type';
import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';

export class NgssmSetDataSourceParameterAction<TParameter = any> extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly parameter?: TParameter
  ) {
    super(NgssmDataActionType.setDataSourceParameter, key);
  }
}
