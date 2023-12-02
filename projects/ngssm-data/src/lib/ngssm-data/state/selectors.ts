import { State } from 'ngssm-store';
import { NgssmDataSourceValue, NgssmDataSourceValueStatus } from '../model';
import { selectNgssmDataState } from './ngssm-data.state';

export const selectNgssmDataSourceValue = <TDataType = any, TParameter = any>(
  state: State,
  key: string
): NgssmDataSourceValue<TDataType, TParameter> => {
  return (
    selectNgssmDataState(state).dataSourceValues[key] ?? {
      status: NgssmDataSourceValueStatus.notRegistered
    }
  );
};
