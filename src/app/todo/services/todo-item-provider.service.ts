import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';

import { RemoteDataGetterParams, RemoteDataProvider } from 'ngssm-remote-data';

import { TodoItem, todoItemKey } from '../model';
import { items } from './todo-items.service';

@Injectable({
  providedIn: 'root'
})
export class TodoItemProviderService implements RemoteDataProvider<TodoItem, number> {
  public remoteDataKey: string = todoItemKey;

  public get(params?: RemoteDataGetterParams<number> | undefined): Observable<TodoItem> {
    const wantedId = params?.serviceParams;
    if (!wantedId) {
      throw new Error('Invalid todo item id.');
    }

    const wanted = items.find((i) => i.id === wantedId);
    if (wanted) {
      return of(wanted);
    }

    return throwError(() => ({
      error: { type: 'https://tools.ietf.org/html/rfc7231#section-6.5.4', title: 'Not Found', status: 404 }
    }));
  }
}
