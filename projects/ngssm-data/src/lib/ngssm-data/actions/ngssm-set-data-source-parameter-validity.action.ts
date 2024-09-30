import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';
import { NgssmDataActionType } from './ngssm-data-action-type';

export class NgssmSetDataSourceParameterValidityAction extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly isValid: boolean
  ) {
    super(NgssmDataActionType.setDataSourceParameterValidity, key);
  }
}
