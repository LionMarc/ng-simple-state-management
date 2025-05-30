import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { createSignal, Store } from 'ngssm-store';
import {
  IsNgssmDataSourceValueStatusPipe,
  NgssmRegisterDataSourcesAction,
  NgssmLoadDataSourceValueAction,
  NgssmDataReloadButtonComponent,
  dataSourceToSignal
} from 'ngssm-data';
import { NgssmComponentOverlayDirective } from 'ngssm-toolkit';
import { NgssmAceEditorComponent } from 'ngssm-ace-editor';

import { playersKey, playersLoader, teamsKey } from '../../model';
import { ComponentWithScopedDataSourceComponent } from '../component-with-scoped-data-source/component-with-scoped-data-source.component';

@Component({
  selector: 'ngssm-ngssm-data-demo',
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    IsNgssmDataSourceValueStatusPipe,
    NgssmDataReloadButtonComponent,
    NgssmComponentOverlayDirective,
    NgssmAceEditorComponent,
    ComponentWithScopedDataSourceComponent
  ],
  templateUrl: './ngssm-data-demo.component.html',
  styleUrls: ['./ngssm-data-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmDataDemoComponent {
  protected readonly store = inject(Store);

  public readonly teamsKey = teamsKey;
  public readonly playersKey = playersKey;

  public readonly teamsSourceValue = dataSourceToSignal<unknown>(teamsKey, { defaultValue: {} });
  public readonly playersSourceValue = dataSourceToSignal<unknown>(playersKey, { defaultValue: {} });
  public readonly componentWithScopedDatasourceRendered = signal<boolean>(false);
  public readonly state = createSignal<string>(state => JSON.stringify(state, undefined, 4));

  public reloadTeams(): void {
    this.store.dispatchAction(new NgssmLoadDataSourceValueAction(teamsKey, { forceReload: true }));
  }

  public reloadPlayers(): void {
    this.store.dispatchAction(new NgssmLoadDataSourceValueAction(playersKey, { forceReload: true }));
  }

  public registerPlayers(): void {
    this.store.dispatchAction(
      new NgssmRegisterDataSourcesAction([
        {
          key: playersKey,
          dataLoadingFunc: playersLoader,
          dataLifetimeInSeconds: 120
        }
      ])
    );
  }
}
