import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
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
    {
      provide: APP_INITIALIZER,
      useFactory: registerFeatureState(featureStateKey, initialValue),
      multi: true,
      deps: [Store]
    }
  ]);
};
