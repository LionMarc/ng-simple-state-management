import { Directive, HostBinding, Inject, Optional } from '@angular/core';

import { NgssmAgGridOptions, NGSSM_AG_GRID_OPTIONS } from '../ngssm-ag-grid-options';

@Directive({
  selector: '[ngssmAgGridTheme]'
})
export class NgssmAgGridThemeDirective {
  @HostBinding('class') className = '';

  constructor(@Inject(NGSSM_AG_GRID_OPTIONS) @Optional() options: NgssmAgGridOptions) {
    this.className = (options ?? new NgssmAgGridOptions()).theme;
  }
}
