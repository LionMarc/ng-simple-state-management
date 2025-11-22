import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { Store } from 'ngssm-store';
import { ToolkitDemoActionType } from '../../actions';

@Component({
  selector: 'ngssm-dialog-demo',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dialog-demo.component.html',
  styleUrls: ['./dialog-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogDemoComponent {
  private readonly store = inject(Store);

  public close(): void {
    this.store.dispatchActionType(ToolkitDemoActionType.closeDialogDemo);
  }
}
