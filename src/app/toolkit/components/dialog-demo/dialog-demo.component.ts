import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { NgSsmComponent, Store } from 'ngssm-store';
import { ToolkitDemoActionType } from '../../actions';

@Component({
    selector: 'app-dialog-demo',
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    templateUrl: './dialog-demo.component.html',
    styleUrls: ['./dialog-demo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogDemoComponent extends NgSsmComponent {
  constructor(store: Store) {
    super(store);
  }

  public close(): void {
    this.dispatchActionType(ToolkitDemoActionType.closeDialogDemo);
  }
}
