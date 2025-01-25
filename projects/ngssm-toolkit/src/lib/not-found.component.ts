import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'ngssm-not-found',
  imports: [CommonModule],
  template: ` <img src="./assets/404-not-found.png" alt="not found"/> `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: row;
        flex: 1;
        align-items: center;
        justify-content: center;
      }
    `
  ]
})
export class NotFoundComponent {}
