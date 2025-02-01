import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { NgSsmComponent, Store } from 'ngssm-store';
import {
  IsNgssmDataSourceValueStatusPipe,
  NgssmRegisterDataSourcesAction,
  NgssmLoadDataSourceValueAction,
  selectNgssmDataSourceValue,
  NgssmDataReloadButtonComponent
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
export class NgssmDataDemoComponent extends NgSsmComponent {
  public readonly teamsKey = teamsKey;
  public readonly playersKey = playersKey;

  public readonly teamsSourceValue = signal<unknown>({});
  public readonly playersSourceValue = signal<unknown>({});
  public readonly componentWithScopedDatasourceRendered = signal<boolean>(false);
  public readonly state = signal<string>('{}');

  constructor(store: Store) {
    super(store);

    this.watch((s) => selectNgssmDataSourceValue(s, teamsKey)).subscribe((v) => this.teamsSourceValue.set(v));
    this.watch((s) => selectNgssmDataSourceValue(s, playersKey)).subscribe((v) => this.playersSourceValue.set(v));
    this.watch((s) => s).subscribe((s) => this.state.set(JSON.stringify(s, undefined, 4)));
  }

  public reloadTeams(): void {
    this.dispatchAction(new NgssmLoadDataSourceValueAction(teamsKey, { forceReload: true }));
  }

  public reloadPlayers(): void {
    this.dispatchAction(new NgssmLoadDataSourceValueAction(playersKey, { forceReload: true }));
  }

  public registerPlayers(): void {
    this.dispatchAction(
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
