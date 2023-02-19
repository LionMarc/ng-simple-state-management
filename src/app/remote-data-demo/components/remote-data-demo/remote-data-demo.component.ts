import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { NgSsmComponent, Store } from 'ngssm-store';
import { NgssmRemoteCallDirective, NgssmRemoteCallResultAction, RemoteCall, RemoteCallStatus, selectRemoteCall } from 'ngssm-remote-data';
import { Observable } from 'rxjs';
import { RemoteDataDemoActionType } from '../../actions';

@Component({
  selector: 'app-remote-data-demo',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, NgssmRemoteCallDirective],
  templateUrl: './remote-data-demo.component.html',
  styleUrls: ['./remote-data-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoteDataDemoComponent extends NgSsmComponent {
  constructor(store: Store) {
    super(store);
  }

  public get remoteCall$(): Observable<RemoteCall> {
    return this.watch((s) => selectRemoteCall(s, 'demo'));
  }

  public startCall(): void {
    this.dispatchActionType(RemoteDataDemoActionType.startRemoteCall);
  }

  public endCallWithSuccess(): void {
    this.dispatchAction(new NgssmRemoteCallResultAction(RemoteDataDemoActionType.endRemoteCall, { status: RemoteCallStatus.done }));
  }
}
