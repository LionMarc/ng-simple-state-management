import { EnvironmentProviders, makeEnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { Store } from '../store';
import { NgssmRegisterFeatureStateAction } from '../actions';

const registerFeatureState = (featureStateKey: string, initialValue: object) => {
  return () => {
    inject(Store).dispatchAction(new NgssmRegisterFeatureStateAction(featureStateKey, initialValue));
  };
};

export const provideNgssmFeatureState = (featureStateKey: string, initialValue: object): EnvironmentProviders => {
  return makeEnvironmentProviders([provideAppInitializer(registerFeatureState(featureStateKey, initialValue))]);
};
