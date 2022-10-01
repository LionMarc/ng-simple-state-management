import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgssmAgGridDirective } from './components/ngssm-ag-grid.directive';
import { gridStatesReducerProvider } from './reducers/grid-states.reducer';
import { selectedRowsReducerProvider } from './reducers/selected-rows.reducer';

@NgModule({
  declarations: [NgssmAgGridDirective],
  imports: [],
  exports: [NgssmAgGridDirective],
  providers: [selectedRowsReducerProvider]
})
export class NgssmAgGridModule {
  static forRoot(): ModuleWithProviders<NgssmAgGridModule> {
    return {
      ngModule: NgssmAgGridModule,
      providers: [gridStatesReducerProvider]
    };
  }
}
