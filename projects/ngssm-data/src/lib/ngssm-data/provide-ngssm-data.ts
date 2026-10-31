import { EnvironmentProviders, makeEnvironmentProviders, inject, provideAppInitializer } from '@angular/core';

import { Store, provideEffectFunc, provideEffects, provideReducerFunc } from 'ngssm-store';

import { NGSSM_DATA_SOURCE, NgssmDataSource } from './model';
import {
  clearDataSourceAdditionalPropertyValue,
  clearDataSourceValue,
  loadDataSourceAdditionalPropertyValue,
  loadDataSourceValue,
  registerDataSource,
  registerDataSources,
  setDataSourceAdditionalPropertyValue,
  setDataSourceParameter,
  setDataSourceParameterValidity,
  setDataSourceValue,
  unregisterDataSource,
  updateDataSourceParameter,
  updateDataSourceParameterWithFunction
} from './reducers';
import { DataLoadingEffect } from './effects';
import { NgssmDataActionType, NgssmRegisterDataSourcesAction } from './actions';
import { postLoadingActionExecutorInitializer } from './post-loading-action-executor';
import { dataSourcesLinkerInitializer } from './data-sources-linker';
import { dependentDataSourceLoadInitializer, loadDataSourceWithDependencyEffect } from './data-source-with-dependency';

const initDataSourceValues = () => {
  const store = inject(Store);
  const dataSources = (inject(NGSSM_DATA_SOURCE, { optional: true }) as unknown as NgssmDataSource[]) ?? [];
  if (dataSources.length > 0) {
    store.dispatchAction(new NgssmRegisterDataSourcesAction(dataSources));
  }
};

export const provideNgssmData = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideAppInitializer(initDataSourceValues),
    provideAppInitializer(postLoadingActionExecutorInitializer),
    provideAppInitializer(dataSourcesLinkerInitializer),
    provideAppInitializer(dependentDataSourceLoadInitializer),
    provideReducerFunc([NgssmDataActionType.registerDataSources], registerDataSources),
    provideReducerFunc([NgssmDataActionType.registerDataSource], registerDataSource),
    provideReducerFunc([NgssmDataActionType.unregisterDataSource], unregisterDataSource),
    provideReducerFunc([NgssmDataActionType.loadDataSourceValue], loadDataSourceValue),
    provideReducerFunc([NgssmDataActionType.setDataSourceValue], setDataSourceValue),
    provideReducerFunc([NgssmDataActionType.clearDataSourceValue], clearDataSourceValue),
    provideReducerFunc([NgssmDataActionType.loadDataSourceAdditionalPropertyValue], loadDataSourceAdditionalPropertyValue),
    provideReducerFunc([NgssmDataActionType.setDataSourceAdditionalPropertyValue], setDataSourceAdditionalPropertyValue),
    provideReducerFunc([NgssmDataActionType.clearDataSourceAdditionalPropertyValue], clearDataSourceAdditionalPropertyValue),
    provideReducerFunc([NgssmDataActionType.setDataSourceParameter], setDataSourceParameter),
    provideReducerFunc([NgssmDataActionType.updateDataSourceParameter], updateDataSourceParameter),
    provideReducerFunc([NgssmDataActionType.updateDataSourceParameterWithFunction], updateDataSourceParameterWithFunction),
    provideReducerFunc([NgssmDataActionType.setDataSourceParameterValidity], setDataSourceParameterValidity),
    provideEffects(DataLoadingEffect),
    provideEffectFunc(NgssmDataActionType.loadDataSourceValue, loadDataSourceWithDependencyEffect)
  ]);
};
