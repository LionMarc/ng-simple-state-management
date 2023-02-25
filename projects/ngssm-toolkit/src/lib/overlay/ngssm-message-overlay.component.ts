import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'ngssm-message-overlay',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  template: `
    <mat-card>
      <mat-card-content class="message-container">
        <mat-spinner></mat-spinner>
        {{ message$ | async }}
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
  public message$: Observable<string> = new Subject<string>();
}
