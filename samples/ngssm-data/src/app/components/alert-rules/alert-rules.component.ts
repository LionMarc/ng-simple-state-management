import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';

import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, ValueGetterParams } from 'ag-grid-community';

import { NgssmAgGridThemeDirective } from 'ngssm-ag-grid';
import { dataSourceToSignal, NgssmDataReloadButtonComponent } from 'ngssm-data';

import { AlertRule, alertRulesKey } from '../../model';

@Component({
  selector: 'app-alert-rules',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, AgGridAngular, NgssmDataReloadButtonComponent, NgssmAgGridThemeDirective],
  templateUrl: './alert-rules.component.html',
  styleUrl: './alert-rules.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertRulesComponent {
  public readonly alertRulesSource = dataSourceToSignal<AlertRule[]>(alertRulesKey, {
    type: 'value'
  });

  public readonly gridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: 'Id',
        valueGetter: (params: ValueGetterParams<AlertRule>) => params.data?.id
      },
      {
        headerName: 'Level',
        valueGetter: (params: ValueGetterParams<AlertRule>) => params.data?.level
      },
      {
        headerName: 'Title',
        valueGetter: (params: ValueGetterParams<AlertRule>) => params.data?.title,
        width: 400
      }
    ]
  };
}
