import { Directive, HostBinding, Inject, Optional } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';

import { NgssmAgGridOptions, NGSSM_AG_GRID_OPTIONS } from '../ngssm-ag-grid-options';

@Directive({
  selector: '[ngssmAgGridTheme]',
  standalone: true
})
export class NgssmAgGridThemeDirective {
  @HostBinding('class') className = '';

  constructor(
    @Inject(NGSSM_AG_GRID_OPTIONS) @Optional() options: NgssmAgGridOptions,
    private agGridAngular: AgGridAngular
  ) {
    this.className = (options ?? new NgssmAgGridOptions()).theme;
    if (this.agGridAngular.statusBar === undefined) {
      this.agGridAngular.statusBar = options?.statusBar;
    }

    if (this.agGridAngular.defaultColDef === undefined) {
      this.agGridAngular.defaultColDef = options?.defaultColDef;
    }
  }
}
