import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

import {
  NGSSM_COMPUTED_DATA_SOURCE,
  NGSSM_DATA_SOURCE,
  NgssmDataSourceValueStatus,
  NgssmDataStateSpecification,
  updateNgssmDataState
} from 'ngssm-data';
import { Logger, Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { NgssmDataSourceValueSetter } from './ngssm-data-source-value-setter';

export const ngssmDataStateAndSourcesInitializer = () => {
  const logger = inject(Logger);
  logger.information('[ngssm-data-testing] Initialization of state and sources');
  const store = inject(Store);
  if (!(store instanceof StoreMock)) {
    throw new Error('StoreMock is not registered.');
  }

  store.stateValue = {
    ...store.stateValue,
    [NgssmDataStateSpecification.featureStateKey]: NgssmDataStateSpecification.initialState
  };

  const dataSources = [
    ...(inject(NGSSM_DATA_SOURCE, { optional: true }) ?? []),
    ...(inject(NGSSM_COMPUTED_DATA_SOURCE, { optional: true }) ?? [])
  ];
  store.stateValue = dataSources.reduce((previous, current) => {
    return updateNgssmDataState(previous, {
      dataSourceValues: {
        [current.key]: {
          $set: {
            status: NgssmDataSourceValueStatus.none,
            additionalProperties: {}
          }
        }
      }
    });
  }, store.stateValue);
};

export const provideNgssmDataTesting = (): EnvironmentProviders => {
  return makeEnvironmentProviders([provideAppInitializer(ngssmDataStateAndSourcesInitializer), NgssmDataSourceValueSetter]);
};
