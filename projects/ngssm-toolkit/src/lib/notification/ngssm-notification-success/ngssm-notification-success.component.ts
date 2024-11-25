import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ngssm-notification-success',
  imports: [CommonModule, MatIconModule],
  templateUrl: './ngssm-notification-success.component.html',
  styleUrls: ['./ngssm-notification-success.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmNotificationSuccessComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public message: string) {}
}
