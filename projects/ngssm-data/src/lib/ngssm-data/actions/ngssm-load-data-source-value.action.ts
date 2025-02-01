import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';
import { NgssmDataActionType } from './ngssm-data-action-type';
import { NgssmLoadDataSourceOptions } from '../model';

export class NgssmLoadDataSourceValueAction<TParameter = unknown> extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly options?: NgssmLoadDataSourceOptions<TParameter>
  ) {
    super(NgssmDataActionType.loadDataSourceValue, key);
  }
}
