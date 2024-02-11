import { State } from 'ngssm-store';
import { NgssmDataSourceAdditionalPropertyValue, NgssmDataSourceValue, NgssmDataSourceValueStatus } from '../model';
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

export const selectNgssmDataSourceAdditionalPropertyValue = <TProperty = any>(
  state: State,
  key: string,
  property: string
): NgssmDataSourceAdditionalPropertyValue<TProperty> => {
  return (
    selectNgssmDataState(state).dataSourceValues[key]?.additionalProperties[property] ?? {
      status: NgssmDataSourceValueStatus.notRegistered
    }
  );
};
