import { State } from 'ngssm-store';

import { isNgssmComputedDataSource } from '../model';
import { selectNgssmDataState } from '../state';

export const validateDataSourceParameter = (state: State, key: string, parameter: unknown): boolean | undefined => {
  const dataSource = selectNgssmDataState(state).dataSources[key];
  if (!dataSource || isNgssmComputedDataSource(dataSource)) {
    return undefined;
  }

  return dataSource.parameterValidationFunc?.(parameter);
};
