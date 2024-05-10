import { InjectionToken } from '@angular/core';

export interface FeatureStateSpecification {
  readonly featureStateKey: string;
  readonly initialState: object;
}

export const NGSSM_COMPONENT_WITH_FEATURE_STATE = new InjectionToken<FeatureStateSpecification>('NGSSM_COMPONENT_WITH_FEATURE_STATE');
