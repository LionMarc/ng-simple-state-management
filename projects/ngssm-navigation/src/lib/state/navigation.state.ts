import update, { Spec } from 'immutability-helper';

import { NgSsmFeatureState, State } from 'ngssm-store';

export const selectNavigationState = (state: State): NavigationState =>
  state[NavigationStateSpecification.featureStateKey] as NavigationState;

export const updateNavigationState = (state: State, command: Spec<NavigationState, never>): State =>
  update(state, {
    [NavigationStateSpecification.featureStateKey]: command
  });

export interface NavigationState {
  navigationLocked: boolean;
}

@NgSsmFeatureState({
  featureStateKey: NavigationStateSpecification.featureStateKey,
  initialState: NavigationStateSpecification.initialState
})
export class NavigationStateSpecification {
  public static readonly featureStateKey = 'navigation-state';
  public static readonly initialState: NavigationState = {
    navigationLocked: false
  };
}
