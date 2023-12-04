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

import { playersKey, playersLoader, teamsKey } from '../../model';

@Component({
  selector: 'app-ngssm-data-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    IsNgssmDataSourceValueStatusPipe,
    NgssmDataReloadButtonComponent
  ],
  templateUrl: './ngssm-data-demo.component.html',
  styleUrls: ['./ngssm-data-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmDataDemoComponent extends NgSsmComponent {
  public readonly teamsKey = teamsKey;
  public readonly playersKey = playersKey;

  public readonly teamsSourceValue = signal<any>({});
  public readonly playersSourceValue = signal<any>({});

  constructor(store: Store) {
    super(store);

    this.watch((s) => selectNgssmDataSourceValue(s, teamsKey)).subscribe((v) => this.teamsSourceValue.set(v));
    this.watch((s) => selectNgssmDataSourceValue(s, playersKey)).subscribe((v) => this.playersSourceValue.set(v));
  }

  public reloadTeams(): void {
    this.dispatchAction(new NgssmLoadDataSourceValueAction(teamsKey, true));
  }

  public reloadPlayers(): void {
    this.dispatchAction(new NgssmLoadDataSourceValueAction(playersKey, true));
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
