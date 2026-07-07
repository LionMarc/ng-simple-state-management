import { Component, input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'ngssm-help',
  imports: [MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './ngssm-help.component.html'
})
export class NgssmHelpComponent {
  public readonly help = input<string | null | undefined>();
}
