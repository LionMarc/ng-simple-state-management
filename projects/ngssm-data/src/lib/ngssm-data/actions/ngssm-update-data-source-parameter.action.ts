import { NgssmDataActionType } from './ngssm-data-action-type';
import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';

/**
 * Action to update part (partial) of a data source parameter.
 *
 * This action carries a Partial<TParameter> that will be merged with the existing parameter
 * for the specified data source key. By default, updating the parameter will mark the data
 * source value as outdated so it can be reloaded; set doNotUpdateValueOutdated to true to
 * avoid changing the valueOutdated flag when dispatching this action.
 *
 * The update of the parameter in state is made with a shallow merge. So be carefull with
 * the parameter value set in action.
 *
 * @template TParameter Type of the parameter object for the data source.
 * @param key The data source key whose parameter should be updated.
 * @param parameter Partial parameter to merge into the existing parameter.
 * @param doNotUpdateValueOutdated Optional flag to prevent marking the value as outdated.
 */
export class NgssmUpdateDataSourceParameterAction<TParameter = unknown> extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly parameter: Partial<TParameter>,
    public readonly doNotUpdateValueOutdated?: boolean
  ) {
    super(NgssmDataActionType.updateDataSourceParameter, key);
  }
}
