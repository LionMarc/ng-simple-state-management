import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

@Component({
  selector: 'ngssm-demo2',
  imports: [CommonModule],
  templateUrl: './demo2.component.html',
  styleUrls: ['./demo2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Demo2Component extends NgSsmComponent {
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
