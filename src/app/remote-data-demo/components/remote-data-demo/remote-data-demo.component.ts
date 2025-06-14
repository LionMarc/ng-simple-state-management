import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { createSignal, Store } from 'ngssm-store';
import {
  DataStatus,
  NgssmRemoteCallErrorComponent,
  NgssmRemoteCallResultAction,
  NgssmRemoteDataOverlayDirective,
  RemoteCallStatus,
  selectRemoteCall,
  selectRemoteData,
  isNgssmRemoteCallInProgress
} from 'ngssm-remote-data';
import { NgssmComponentOverlayDirective } from 'ngssm-toolkit';

import { RemoteDataDemoActionType, UpdateDataStatusAction } from '../../actions';

@Component({
  selector: 'ngssm-remote-data-demo',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    NgssmComponentOverlayDirective,
    NgssmRemoteDataOverlayDirective,
    NgssmRemoteCallErrorComponent
  ],
  templateUrl: './remote-data-demo.component.html',
  styleUrls: ['./remote-data-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteDataDemoComponent {
  private readonly store = inject(Store);

  protected readonly waitingOverlayRendered = createSignal((state) => isNgssmRemoteCallInProgress(state, 'demo'));

  public readonly dataStatus = DataStatus;
  public readonly dataStatusList = [DataStatus.loading, DataStatus.loaded];
  public readonly dataStatusKeys = ['key1', 'key2', 'key3'];

  public readonly dataStatusControl = new FormControl(DataStatus.loaded);
  public readonly keyControl = new FormControl(this.dataStatusKeys[0]);

  public readonly remoteCall = createSignal((state) => selectRemoteCall(state, 'demo'));
  public readonly statuses = createSignal((state) => {
    const values = this.dataStatusKeys.map((k) => selectRemoteData(state, k)?.status);
    return values.map((v, i) => `${this.dataStatusKeys[i]} - ${v}`);
  });

  public startCall(): void {
    this.store.dispatchActionType(RemoteDataDemoActionType.startRemoteCall);
  }

  public endCallWithSuccess(): void {
    this.store.dispatchAction(new NgssmRemoteCallResultAction(RemoteDataDemoActionType.endRemoteCall, { status: RemoteCallStatus.done }));
  }

  public endCallWithError(): void {
    this.store.dispatchAction(
      new NgssmRemoteCallResultAction(RemoteDataDemoActionType.endRemoteCall, {
        status: RemoteCallStatus.ko,
        error: {
          title: 'testing error',
          errors: {
            propA: ['Invalid value']
          }
        }
      })
    );
  }

  public endCallWithErrorMessage(): void {
    this.store.dispatchAction(
      new NgssmRemoteCallResultAction(RemoteDataDemoActionType.endRemoteCall, {
        status: RemoteCallStatus.ko,
        message: 'Testing error message'
      })
    );
  }

  public updateStatus(): void {
    this.store.dispatchAction(new UpdateDataStatusAction(this.keyControl.value ?? '', this.dataStatusControl.value ?? DataStatus.loaded));
  }
}
