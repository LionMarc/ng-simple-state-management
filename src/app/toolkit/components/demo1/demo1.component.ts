import { Component, ChangeDetectionStrategy, signal } from '@angular/core';


@Component({
  selector: 'ngssm-demo1',
  imports: [],
  templateUrl: './demo1.component.html',
  styleUrls: ['./demo1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Demo1Component {
  public readonly comment = signal<string>('');
}
