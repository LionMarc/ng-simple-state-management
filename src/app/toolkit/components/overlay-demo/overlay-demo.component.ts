import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

import { NgSsmComponent, Store } from 'ngssm-store';

@Component({
  selector: 'app-overlay-demo',
  templateUrl: './overlay-demo.component.html',
  styleUrls: ['./overlay-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayDemoComponent extends NgSsmComponent {
  public readonly rightControl = new FormControl(false);
  public readonly centerControl = new FormControl(false);
  public readonly leftControl = new FormControl(false);
  public readonly mainControl = new FormControl(false);

  constructor(store: Store) {
    super(store);
  }
}
