import { EnvironmentProviders, makeEnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { Store } from '../store';
import { NgssmRegisterFeatureStateAction } from '../actions';

const registerFeatureState = (featureStateKey: string, initialValue: object) => {
  return (store: Store): (() => void) => {
    return () => {
      store.dispatchAction(new NgssmRegisterFeatureStateAction(featureStateKey, initialValue));
    };
  };
};

export const provideNgssmFeatureState = (featureStateKey: string, initialValue: object): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideAppInitializer((registerFeatureState(featureStateKey, initialValue))(inject(Store)))
  ]);
};
