import { Component, ChangeDetectionStrategy, input } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

import { SidenavConfig } from '../../model';
import { WrapperComponent } from '../wrapper/wrapper.component';

@Component({
  selector: 'ngssm-side-nav',
  imports: [MatDividerModule, RouterModule, WrapperComponent],
  templateUrl: './side-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngssm-sidenav'
  }
})
export class SideNavComponent {
  public config = input<SidenavConfig | undefined>();
}
