import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ngssm-demo1',
  imports: [CommonModule],
  templateUrl: './demo1.component.html',
  styleUrls: ['./demo1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Demo1Component {
  public readonly comment = signal<string>('');
}
