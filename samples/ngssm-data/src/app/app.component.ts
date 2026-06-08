import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbar, MatButtonModule],
  templateUrl: './app.component.html',
  styles: [
    `
      :host {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    `
  ]
})
export class AppComponent {
  title = 'ngssm-data-demo';
}
