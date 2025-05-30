import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureStateSpecification, NGSSM_COMPONENT_WITH_FEATURE_STATE, ProvideNgssmFeatureStateDirective } from 'ngssm-store';

@Component({
  selector: 'ngssm-component-with-feature-state',
  imports: [CommonModule],
  templateUrl: './component-with-feature-state.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ProvideNgssmFeatureStateDirective],
  providers: [
    {
      provide: NGSSM_COMPONENT_WITH_FEATURE_STATE,
      multi: false,
      useExisting: ComponentWithFeatureStateComponent
    }
  ]
})
export class ComponentWithFeatureStateComponent implements FeatureStateSpecification {
  private static nextId = 1;

  featureStateKey = `my-component-${ComponentWithFeatureStateComponent.nextId++}`;
  initialState = {
    description: 'Feature state with the smae lifetime of the associated component'
  };
}
