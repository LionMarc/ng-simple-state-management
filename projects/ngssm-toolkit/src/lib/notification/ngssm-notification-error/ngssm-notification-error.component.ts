import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'ngssm-notification-error',
  imports: [CommonModule, MatIconModule],
  templateUrl: './ngssm-notification-error.component.html',
  styleUrls: ['./ngssm-notification-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmNotificationErrorComponent {
  public readonly message: string = inject(MAT_SNACK_BAR_DATA);
}
