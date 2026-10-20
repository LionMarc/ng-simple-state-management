import { NgssmDataActionType } from './ngssm-data-action-type';
import { NgssmDataSourceValueAction } from './ngssm-data-source-value.action';

/**
 * Action to update a data source parameter using a function that receives its current value.
 *
 * By default, updating the parameter marks the data source value as outdated; set
 * doNotUpdateValueOutdated to true to avoid changing the valueOutdated flag.
 */
export class NgssmUpdateDataSourceParameterWithFunctionAction<TParameter = unknown> extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly updateParameter: (parameter: TParameter | undefined) => TParameter,
    public readonly doNotUpdateValueOutdated?: boolean
  ) {
    super(NgssmDataActionType.updateDataSourceParameterWithFunction, key);
  }
}
