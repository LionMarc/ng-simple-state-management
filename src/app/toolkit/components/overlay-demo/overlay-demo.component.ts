import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmComponentOverlayDirective } from 'ngssm-toolkit';

@Component({
  selector: 'ngssm-overlay-demo',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatSlideToggleModule, NgssmComponentOverlayDirective],
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
