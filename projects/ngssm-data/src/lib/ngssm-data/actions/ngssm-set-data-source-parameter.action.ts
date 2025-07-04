import { NgssmDataActionType } from './ngssm-data-action-type';
import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';

export class NgssmSetDataSourceParameterAction<TParameter = unknown> extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly parameter?: TParameter,
    public readonly parameterIsValid?: boolean,
    public readonly doNotMarkParameterAsModified?: boolean
  ) {
    super(NgssmDataActionType.setDataSourceParameter, key);
  }
}
