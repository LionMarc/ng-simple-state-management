import { Directive, inject, OnDestroy } from '@angular/core';

import { Store } from '../store';
import { NgssmRegisterFeatureStateAction, NgssmUnregisterFeatureStateAction } from '../actions';
import { FeatureStateSpecification, NGSSM_COMPONENT_WITH_FEATURE_STATE } from './feature-state-specification';

// export interface ComponentWithFeatureState {
//   featureStateKey: string;
//   initialValue: object;
// }

// export const NGSSM_COMPONENT_WITH_FEATURE_STATE = new InjectionToken<ComponentWithFeatureState>('NGSSM_COMPONENT_WITH_FEATURE_STATE');

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[provideNgssmFeatureState]',
  standalone: true
})
export class ProvideNgssmFeatureStateDirective implements OnDestroy {
  private readonly component: FeatureStateSpecification = inject(NGSSM_COMPONENT_WITH_FEATURE_STATE);
  private store = inject(Store);

  constructor() {
    this.store.dispatchAction(new NgssmRegisterFeatureStateAction(this.component.featureStateKey, this.component.initialState));
  }

  public ngOnDestroy(): void {
    this.store.dispatchAction(new NgssmUnregisterFeatureStateAction(this.component.featureStateKey));
  }
}
