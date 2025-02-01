import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

@Component({
  selector: 'ngssm-demo1',
  imports: [CommonModule],
  templateUrl: './demo1.component.html',
  styleUrls: ['./demo1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Demo1Component extends NgSsmComponent {
  private readonly _comment$ = new BehaviorSubject<string>('');

  constructor(store: Store) {
    super(store);
  }

  public get comment$(): Observable<string> {
    return this._comment$.asObservable();
  }

  public setComment(value: string): void {
    this._comment$.next(value);
  }
}
