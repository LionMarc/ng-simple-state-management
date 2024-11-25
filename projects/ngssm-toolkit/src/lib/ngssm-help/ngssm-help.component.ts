import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'ngssm-help',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './ngssm-help.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgssmHelpComponent {
  private readonly _help$ = new BehaviorSubject<string | undefined>(undefined);

  @Input() public set help(value: string | null | undefined) {
    this._help$.next(value ?? undefined);
  }

  public get help$(): Observable<string | undefined> {
    return this._help$.asObservable();
  }
}
