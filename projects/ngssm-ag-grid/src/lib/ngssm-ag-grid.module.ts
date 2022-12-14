import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgssmAgGridDirective } from './components/ngssm-ag-grid.directive';
import { gridStatesReducerProvider } from './reducers/grid-states.reducer';
import { selectedRowsReducerProvider } from './reducers/selected-rows.reducer';
import { localStorageEffectProvider } from './effects/local-storage.effect';
import { NgssmAgGridThemeDirective } from './components/ngssm-ag-grid-theme.directive';

@NgModule({
  declarations: [NgssmAgGridDirective, NgssmAgGridThemeDirective],
  imports: [],
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
