import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmAceEditorComponent } from 'ngssm-ace-editor';
import { ComponentWithFeatureStateComponent } from '../component-with-feature-state/component-with-feature-state.component';

@Component({
  selector: 'app-feature-state-demo',
  imports: [CommonModule, MatCardModule, MatButtonModule, NgssmAceEditorComponent, ComponentWithFeatureStateComponent],
  templateUrl: './feature-state-demo.component.html',
  styleUrls: ['./feature-state-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureStateDemoComponent extends NgSsmComponent {
  public readonly state = signal<string>('{}');
  public readonly componentWithStateRendered = signal<boolean>(false);

  constructor(store: Store) {
    super(store);

    this.watch((s) => s).subscribe((s) => this.state.set(JSON.stringify(s, undefined, 4)));
  }
}
