import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import { TodoItem } from '../model';

@Injectable({
  providedIn: 'root'
})
export class TodoItemsService {
  public readonly items: TodoItem[] = [
    {
      id: 1,
      title: 'Add a schematic for remote data provider'
    },
    {
      id: 2,
      title: 'Find a way to facilitate the configuration of the guards'
    }
  ];
  public nextId = 3;

  public get(): Observable<TodoItem[]> {
    return of([...this.items]).pipe(delay(1000));
  }

  public createTodoItem(item: TodoItem): Observable<TodoItem> {
    const created: TodoItem = {
      ...item,
      id: this.nextId++
    };

    this.items.push(created);

    return of(created).pipe(delay(1000));
  }

  public updateTodoItem(id: number, item: TodoItem): Observable<TodoItem> {
    const updated: TodoItem = {
      ...item,
      id
    };

    const index = this.items.findIndex((i) => i.id === id);
    this.items.splice(index, 1, updated);

    return of(updated).pipe(delay(1000));
  }
}
