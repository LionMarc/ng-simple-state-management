import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'ngssm-message-overlay',
  imports: [MatCardModule, MatProgressSpinnerModule],
  template: `
    <mat-card>
      <mat-card-content class="message-container">
        <mat-spinner></mat-spinner>
        {{ message() }}
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .message-container {
        display: flex !important;
        flex-direction: column;
        align-items: center;
      }
    `
  ]
})
export class NgssmMessageOverlayComponent {
  public message = signal<string>('');
}
