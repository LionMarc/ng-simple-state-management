import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { RemoteDataProvider } from 'ngssm-remote-data';

import { todoItemsKey } from '../model';

@Injectable({
  providedIn: 'root'
})
export class TodoItemsService implements RemoteDataProvider {
  public remoteDataKey: string = todoItemsKey;
  public cacheDurationInSeconds: number = 600;

  constructor() {}

  public get(): Observable<any> {
    return of([
      {
        id: 1,
        title: 'Add a schematic for remote data provider'
      },
      {
        id: 2,
        title: 'Find a way to facilitate the configuration of the guards'
      }
    ]).pipe(delay(1000));
  }
}
