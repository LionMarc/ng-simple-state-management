import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NgssmAgGridDirective } from './components/ngssm-ag-grid.directive';
import { gridStatesReducerProvider } from './reducers/grid-states.reducer';
import { selectedRowsReducerProvider } from './reducers/selected-rows.reducer';
import { localStorageEffectProvider } from './effects/local-storage.effect';
import { NgssmAgGridThemeDirective } from './components/ngssm-ag-grid-theme.directive';
import { NgssmActionsCellRendererComponent } from './components/ngssm-actions-cell-renderer/ngssm-actions-cell-renderer.component';

@NgModule({
  declarations: [NgssmAgGridDirective, NgssmAgGridThemeDirective, NgssmActionsCellRendererComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [NgssmAgGridDirective, NgssmAgGridThemeDirective],
  providers: []
})
export class NgssmAgGridModule {
  static forRoot(): ModuleWithProviders<NgssmAgGridModule> {
    return {
      ngModule: NgssmAgGridModule,
      providers: [gridStatesReducerProvider, selectedRowsReducerProvider, localStorageEffectProvider]
    };
  }
}
