import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ngssm-demo2',
  imports: [CommonModule],
  templateUrl: './demo2.component.html',
  styleUrls: ['./demo2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Demo2Component {
  public readonly comment = input<string>('');
}
