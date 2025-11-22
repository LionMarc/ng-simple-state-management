import { Component, ChangeDetectionStrategy } from '@angular/core';

import { of } from 'rxjs';

import { NgssmDataSource, NgssmScopedDataSourceDirective } from 'ngssm-data';

@Component({
  selector: 'ngssm-component-with-scoped-data-source',
  imports: [NgssmScopedDataSourceDirective],
  templateUrl: './component-with-scoped-data-source.component.html',
  styleUrls: ['./component-with-scoped-data-source.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentWithScopedDataSourceComponent {
  private static nextId = 1;
  public readonly dataSource: NgssmDataSource<string[], unknown> = {
    key: `scoped-${ComponentWithScopedDataSourceComponent.nextId++}`,
    dataLoadingFunc: () => of([])
  };
}
