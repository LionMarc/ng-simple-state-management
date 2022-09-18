import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { RemoteDataProvider } from 'ngssm-remote-data';

import { TodoItem, todoItemsKey } from '../model';

const items: TodoItem[] = [
  {
    id: 1,
    title: 'Add a schematic for remote data provider'
  },
  {
    id: 2,
    title: 'Find a way to facilitate the configuration of the guards'
  }
];
let nextId = 3;

@Injectable({
  providedIn: 'root'
})
export class TodoItemsService implements RemoteDataProvider {
  public remoteDataKey: string = todoItemsKey;
  public cacheDurationInSeconds: number = 600;

  constructor() {}

  public get(): Observable<any> {
    return of([...items]).pipe(delay(1000));
  }

  public createTodoItem(item: TodoItem): Observable<TodoItem> {
    const created: TodoItem = {
      ...item,
      id: nextId++
    };

    items.push(created);

    return of(created).pipe(delay(1000));
  }

  public updateTodoItem(id: number, item: TodoItem): Observable<TodoItem> {
    const updated: TodoItem = {
      ...item,
      id
    };

    const index = items.findIndex((i) => i.id === id);
    items.splice(index, 1, updated);

    return of(updated).pipe(delay(1000));
  }
}
