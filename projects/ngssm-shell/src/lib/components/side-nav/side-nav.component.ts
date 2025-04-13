import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

import { SidenavConfig } from '../../model';
import { WrapperComponent } from '../wrapper/wrapper.component';

@Component({
  selector: 'ngssm-side-nav',
  imports: [CommonModule, MatDividerModule, RouterModule, WrapperComponent],
  templateUrl: './side-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngssm-sidenav'
  }
})
export class SideNavComponent {
  public config = input<SidenavConfig | undefined>();
}
