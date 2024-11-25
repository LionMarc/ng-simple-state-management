import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmDataSource, NgssmScopedDataSourceDirective } from 'ngssm-data';

@Component({
  selector: 'app-component-with-scoped-data-source',
  imports: [CommonModule, NgssmScopedDataSourceDirective],
  templateUrl: './component-with-scoped-data-source.component.html',
  styleUrls: ['./component-with-scoped-data-source.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentWithScopedDataSourceComponent extends NgSsmComponent {
  private static nextId = 1;
  public readonly dataSource: NgssmDataSource<string[], unknown> = {
    key: `scoped-${ComponentWithScopedDataSourceComponent.nextId++}`,
    dataLoadingFunc: () => of([])
  };

  constructor(store: Store) {
    super(store);
  }
}
