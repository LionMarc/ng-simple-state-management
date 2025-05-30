import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { createSignal } from 'ngssm-store';
import { NgssmAceEditorComponent } from 'ngssm-ace-editor';
import { ComponentWithFeatureStateComponent } from '../component-with-feature-state/component-with-feature-state.component';

@Component({
  selector: 'ngssm-feature-state-demo',
  imports: [CommonModule, MatCardModule, MatButtonModule, NgssmAceEditorComponent, ComponentWithFeatureStateComponent],
  templateUrl: './feature-state-demo.component.html',
  styleUrls: ['./feature-state-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureStateDemoComponent {
  public readonly state = createSignal<string>((state) => JSON.stringify(state, undefined, 4));
  public readonly componentWithStateRendered = signal<boolean>(false);
}
