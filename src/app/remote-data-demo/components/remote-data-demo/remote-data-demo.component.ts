import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';
import {
  DataStatus,
  NgssmRemoteCallDirective,
  NgssmRemoteCallErrorComponent,
  NgssmRemoteCallResultAction,
  NgssmRemoteDataOverlayDirective,
  RemoteCall,
  RemoteCallStatus,
  selectRemoteCall,
  selectRemoteData
} from 'ngssm-remote-data';

import { RemoteDataDemoActionType, UpdateDataStatusAction } from '../../actions';

@Component({
    selector: 'app-remote-data-demo',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCardModule,
        MatButtonModule,
        NgssmRemoteCallDirective,
        NgssmRemoteDataOverlayDirective,
        NgssmRemoteCallErrorComponent
    ],
    templateUrl: './remote-data-demo.component.html',
    styleUrls: ['./remote-data-demo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteDataDemoComponent extends NgSsmComponent {
  private readonly _statuses$ = new BehaviorSubject<string[]>([]);

  public readonly dataStatus = DataStatus;
  public readonly dataStatusList = [DataStatus.loading, DataStatus.loaded];
  public readonly dataStatusKeys = ['key1', 'key2', 'key3'];

  public readonly dataStatusControl = new FormControl(DataStatus.loaded);
  public readonly keyControl = new FormControl(this.dataStatusKeys[0]);

  constructor(store: Store) {
    super(store);

    combineLatest(this.dataStatusKeys.map((k) => this.watch((s) => selectRemoteData(s, k)?.status))).subscribe((values) => {
      this._statuses$.next(values.map((v, i) => `${this.dataStatusKeys[i]} - ${v}`));
    });
  }

  public get remoteCall$(): Observable<RemoteCall> {
    return this.watch((s) => selectRemoteCall(s, 'demo'));
  }

  public get statuses$(): Observable<string[]> {
    return this._statuses$.asObservable();
  }

  public startCall(): void {
    this.dispatchActionType(RemoteDataDemoActionType.startRemoteCall);
  }

  public endCallWithSuccess(): void {
    this.dispatchAction(new NgssmRemoteCallResultAction(RemoteDataDemoActionType.endRemoteCall, { status: RemoteCallStatus.done }));
  }

  public endCallWithError(): void {
    this.dispatchAction(
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
    this.dispatchAction(
      new NgssmRemoteCallResultAction(RemoteDataDemoActionType.endRemoteCall, {
        status: RemoteCallStatus.ko,
        message: 'Testing error message'
      })
    );
  }

  public updateStatus(): void {
    this.dispatchAction(new UpdateDataStatusAction(this.keyControl.value ?? '', this.dataStatusControl.value ?? DataStatus.loaded));
  }
}
