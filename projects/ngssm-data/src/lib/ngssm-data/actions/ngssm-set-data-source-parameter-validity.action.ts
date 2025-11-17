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
 * If `partialValidityKey` is provided the action targets only that partial entry and
 * does not change the global `parameterIsValid` flag. If `clearPartialValidities` is
 * true the reducer handling this action should clear the parameterPartialValidity map
 * (remove all partial validity entries) when applying the global validity update.
 *
 * @param key The data source key this validity applies to.
 * @param isValid True when the parameter (or partial parameter) is valid, false otherwise.
 * @param partialValidityKey Optional identifier for partial validity (e.g. the parameter field name).
 *                            If set, the global validity is not modified.
 * @param clearPartialValidities If true, instructs reducers to clear existing partial validity entries
 *                               when updating overall validity. Useful to reset per-field validity after
 *                               a full-parameter validation step.
 */
export class NgssmSetDataSourceParameterValidityAction extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly isValid: boolean,
    public readonly partialValidityKey?: string,
    public readonly clearPartialValidities?: boolean
  ) {
    super(NgssmDataActionType.setDataSourceParameterValidity, key);
  }
}
