import { NgssmDataActionType } from './ngssm-data-action-type';
import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';

export class NgssmUpdateDataSourceParameterAction<TParameter = unknown> extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly parameter: Partial<TParameter>
  ) {
    super(NgssmDataActionType.updateDataSourceParameter, key);
  }
}
