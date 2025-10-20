import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';
import { NgssmDataActionType } from './ngssm-data-action-type';

/**
 * Action used to set the validity state of a data source parameter.
 *
 * This action updates the overall parameter validity for the specified data source.
 * Optionally a partial validity key can be provided to indicate which sub-field or
 * portion of the parameter the validity refers to (useful when validating parameter
 * objects field-by-field).
 *
 * @param key The data source key this validity applies to.
 * @param isValid True when the parameter (or partial parameter) is valid, false otherwise.
 * @param partialValidityKey Optional identifier for partial validity (e.g. the parameter field name). If set, the global validity is not modified.
 */
export class NgssmSetDataSourceParameterValidityAction extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly isValid: boolean,
    public readonly partialValidityKey?: string
  ) {
    super(NgssmDataActionType.setDataSourceParameterValidity, key);
  }
}
